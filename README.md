# 🌍 TravelTogether

Find your perfect travel companions — match with like-minded travellers, split
trip costs, plan itineraries together, and explore destinations across India
and abroad.

![Tech](https://img.shields.io/badge/React-19-61dafb) ![Tech](https://img.shields.io/badge/TypeScript-5.9-3178c6) ![Tech](https://img.shields.io/badge/Vite-7-646cff) ![Tech](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Deploy

The build is a **single self-contained HTML file** — host it anywhere.

**Fastest option:** run `npm run build`, then drag the `dist` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop).

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Vercel, Netlify, GitHub Pages,
Cloudflare and custom-server instructions.

---

## Project structure

```
travel-together/
│
├── backend/                  ← All data & business logic (no React)
│   ├── config/               Credentials, storage keys
│   ├── models/               TypeScript schemas
│   ├── data/                 Seed data + 20 destinations
│   ├── services/             database · location · connection · admin · email
│   └── utils/                Helpers
│
├── frontend/
│   └── api/                  The single frontend ⇄ backend boundary
│
├── src/                      Vite source root
│   ├── components/           React UI
│   ├── hooks/
│   └── services/             Thin shims → frontend/api
│
├── public/                   Static assets (icon, robots, sitemap, manifest)
├── .github/workflows/        GitHub Pages CI
├── vercel.json               Vercel config
├── netlify.toml              Netlify config
├── DEPLOYMENT.md             Deploy guide
├── ARCHITECTURE.md           Architecture notes
└── MONGODB_BACKEND.md        Real-server migration guide
```

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full breakdown.

---

## Features

**Landing page** — sticky navbar, hero, social proof, features, product
showcase, benefits, testimonials (with Indian reviews), pricing in ₹, FAQ, CTA,
footer. Scroll reveals, staggered entrances, glassmorphism, ambient motion.

**Traveller app**

| Section | What it does |
|---|---|
| 🗺️ Destinations | 20 destinations — **In India** / **Abroad** toggle, expandable cards with weather, visa info for Indian passports, ₹ budgets, best season |
| 🧭 Explore Trips | Browse, filter, sort, save, create and join trips |
| 👥 Find Matches | AI-style compatibility scoring on interests, travel style, budget, pace |
| 💌 Requests | Send / accept / reject connection requests with notifications both ways |
| 💬 Messages | Per-trip group chat with emoji picker |
| 👤 Profile | Bio, interests, preferences, saved destinations, trips, achievement badges |

**Admin panel** — hidden from all regular users. Login with the admin email +
password to access login/signup notifications, full user list with clickable
profiles, email delivery log, and editable EmailJS configuration.

---

## Login credentials

| Role | Email | Password |
|---|---|---|
| Demo user | `elena@example.com` | `password123` |

Other demo users (all `password123`): `marcus@example.com`,
`priya@example.com`, `david@example.com`, `yuki@example.com`

---

## Email automation

Powered by [EmailJS](https://www.emailjs.com) using a **single template** for
all mail types.

| Trigger | Recipient | Content |
|---|---|---|
| User signs up | The user | 🎉 Welcome onboarding email |
| User signs up | Admin | 🆕 New registration alert |
| User logs in | The user | 👋 Welcome back email |
| User logs in | Admin | 🔔 Login alert |

Admin logins are excluded from notifications. Keys can be changed at runtime
from **Admin Panel → Email Setup**.

---

## Tech stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** with `vite-plugin-singlefile`
- **Tailwind CSS 4**
- **lucide-react** icons
- **@emailjs/browser**

---

## ⚠️ Data persistence

Data is stored in the browser's **localStorage**, so it's per-device and does
not sync between users. This is ideal for a demo/portfolio/MVP.

For real multi-user production, the `backend/` folder is already isolated and
ready to become an Express + MongoDB server — you'd only need to change
`frontend/api/index.ts`. Full guide in
**[MONGODB_BACKEND.md](./MONGODB_BACKEND.md)**.
