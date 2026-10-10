# 🚀 Deploying TravelTogether

The build produces a **single self-contained `dist/index.html`** — all JS, CSS
and assets are inlined. That means you can host it literally anywhere.

```bash
npm install
npm run build      # → dist/index.html
```

---

## Option 1 — Vercel (recommended, easiest)

**Via the website (no CLI needed):**

1. Push this project to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Vite — just click **Deploy**
5. Live in ~40 seconds at `your-project.vercel.app`

**Via CLI:**

```bash
npm i -g vercel
vercel --prod
```

`vercel.json` is already configured with the correct build command, SPA
rewrites, security headers and asset caching.

---

## Option 2 — Netlify

**Drag & drop (fastest possible):**

1. Run `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the entire `dist` folder onto the page
4. Done — you get a live URL instantly

**Git-connected (auto-deploys on every push):**

1. Push to GitHub
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Settings are read automatically from `netlify.toml`

**Via CLI:**

```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## Option 3 — GitHub Pages (free, no signup)

A workflow is already included at `.github/workflows/deploy.yml`.

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, choose **GitHub Actions**
4. Push to `main` — the site deploys automatically

Your URL will be `https://<username>.github.io/<repo-name>/`

> **Note:** if deploying to a sub-path (i.e. not a `username.github.io` root
> repo), you'll need to set `base: '/<repo-name>/'` in `vite.config.ts`.

---

## Option 4 — Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages**
2. Connect your GitHub repo
3. Build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. **Save and Deploy**

---

## Option 5 — Any static host / your own server

Because the build is one HTML file, you can simply upload it:

```bash
npm run build
# then upload the contents of dist/ via FTP, scp, S3, etc.
scp -r dist/* user@yourserver:/var/www/html/
```

Works on: Firebase Hosting, AWS S3 + CloudFront, Render, Railway, Surge,
DigitalOcean App Platform, cPanel shared hosting, Nginx, Apache…

---

## Environment variables

A working **`.env` file is already created** in the project root with all your
real values, so `npm run dev` and `npm run build` work immediately with no
setup.

Every value also has a hard-coded fallback in `backend/config/app.config.ts`,
so **the site still works even if `.env` is missing** — which is important
because `.env` is gitignored and won't be pushed to GitHub.

### Adding them to your host (optional but recommended)

Since `.env` isn't committed, add these in your hosting dashboard if you want
to change values later without redeploying code:

| Variable | Value |
|---|---|
| `VITE_EMAILJS_PUBLIC_KEY` | `86IO3ZH43hjFBN8_U` |
| `VITE_EMAILJS_SERVICE_ID` | `service_wf8c6jf` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_vqok13a` |
| `VITE_ADMIN_EMAIL` | `mohdairaz477@gmail.com` |
| `VITE_ADMIN_PASSWORD` | `admin@8520` |
| `VITE_SITE_NAME` | `TravelTogether` |
| `VITE_SITE_URL` | `https://your-domain.com` |

**Where to add them:**
- **Vercel** → Project → Settings → Environment Variables
- **Netlify** → Site configuration → Environment variables
- **Cloudflare Pages** → Settings → Environment variables
- **GitHub Pages** → Repo → Settings → Secrets and variables → Actions

After adding/changing variables you must **redeploy** for them to take effect.

### To change a value locally

Edit `.env` and restart the dev server:

```bash
# edit .env, then
npm run dev
```

> ⚠️ Anything prefixed `VITE_` is **compiled into the browser bundle and is
> publicly visible**. EmailJS public keys are designed to be public, so that's
> fine. Never put a database password or private API secret in a `VITE_`
> variable — those belong on a real backend server.

---

## Custom domain

| Host | Where to add it |
|---|---|
| Vercel | Project → Settings → Domains |
| Netlify | Site → Domain management → Add custom domain |
| GitHub Pages | Settings → Pages → Custom domain |
| Cloudflare | Pages project → Custom domains |

Then point your DNS:

```
Type    Name    Value
A       @       <IP given by host>
CNAME   www     <your-project>.vercel.app
```

After connecting a domain, update these three files to match it:
- `public/robots.txt` → sitemap URL
- `public/sitemap.xml` → all `<loc>` URLs
- `index.html` → `og:url` and `canonical`

---

## Pre-deploy checklist

- [ ] `npm run build` completes with no errors
- [ ] `npm run preview` — test the production build locally at `localhost:4173`
- [ ] Test admin login: `mohdairaz477@gmail.com` / `admin@8520`
- [ ] Test demo user login: `elena@example.com` / `password123`
- [ ] Check mobile view (DevTools → device toolbar)
- [ ] Verify EmailJS sends on login (check browser console)
- [ ] Update domain URLs in `robots.txt`, `sitemap.xml`, `index.html`

---

## ⚠️ Important note about data persistence

This build stores all data in the browser's **localStorage**. That means:

- Data is **per-device** — a user on their phone won't see data from their laptop
- Clearing browser data wipes everything
- Users cannot actually see each other's real accounts across devices

This is perfect for a **demo, portfolio piece, or MVP**.

For a real multi-user production app you need a real server + database. The
codebase is already prepared for this: `backend/` is fully isolated from the UI,
and `frontend/api/index.ts` is the single file you'd change to point at HTTP
endpoints. See **`MONGODB_BACKEND.md`** for the complete migration guide with
Express routes and Mongoose schemas.
