# Backend — TravelTogether

All server-side / data logic lives here. **No React, no JSX, no UI code.**

## Structure

```
backend/
├── config/
│   └── app.config.ts          # EmailJS keys, admin credentials, storage keys
├── models/
│   └── index.ts               # All data schemas (User, Trip, Message, Location…)
├── data/
│   ├── seed.data.ts           # Initial users / trips / messages
│   └── locations.data.ts      # 20 destinations (10 India + 10 international)
├── services/
│   ├── database.service.ts    # CRUD + auth + matching  (the `db` object)
│   ├── location.service.ts    # Destination queries, saved/wishlist/visited
│   ├── connection.service.ts  # Connection requests (send/accept/reject)
│   ├── admin.service.ts       # Admin auth + notification feed
│   └── email.service.ts       # EmailJS transport (admin alerts + welcome mails)
├── utils/
│   └── helpers.ts             # generateId, hashPassword, storage helpers
└── index.ts                   # Public barrel — the only thing frontend imports
```

## Layer rules

| Layer | May import from |
|---|---|
| `config/` | nothing |
| `models/` | nothing |
| `utils/` | nothing |
| `data/` | `models`, `utils` |
| `services/` | `config`, `models`, `data`, `utils`, other services |
| `index.ts` | everything (barrel only) |

There are **no circular dependencies**.

## Public API

The frontend only ever imports from `backend/index.ts`:

```ts
import { db, locationService, adminService, connectionService, emailService } from '../../backend';
```

## Credentials

| Setting | Value |
|---|---|
| Admin email | `mohdairaz477@gmail.com` |
| Admin password | `admin@8520` |
| EmailJS Public Key | `86IO3ZH43hjFBN8_U` |
| EmailJS Service ID | `service_wf8c6jf` |
| EmailJS Template ID | `template_vqok13a` |

EmailJS values can be overridden at runtime from **Admin Panel → Email Setup**
(stored under `tt_email_runtime_config`).

## Migrating to a real MongoDB server

The service signatures already mirror Mongoose. To go live:

1. Move `backend/` into its own Node/Express project.
2. Replace `localStorage` reads/writes in `services/*` with Mongoose calls.
3. Turn each service method into an Express route.
4. Update **only** `frontend/api/index.ts` to call those routes with `fetch()`.

No UI component needs to change. See `MONGODB_BACKEND.md` in the project root
for the full step-by-step guide with schema and route examples.
