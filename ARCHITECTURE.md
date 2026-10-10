# TravelTogether — Project Architecture

The project is split into **backend** and **frontend** layers.

```
travel-together/
│
├── backend/                    ← ALL data & business logic (no React)
│   ├── config/                 Credentials, storage keys, limits
│   ├── models/                 TypeScript schemas
│   ├── data/                   Seed records + destinations dataset
│   ├── services/               database, location, connection, admin, email
│   ├── utils/                  id generation, hashing, storage helpers
│   ├── index.ts                Public barrel export
│   └── README.md
│
├── frontend/                   ← UI layer
│   ├── api/index.ts            The single frontend ⇄ backend boundary
│   └── README.md
│
├── src/                        ← Vite source root (locked by vite.config.ts)
│   ├── main.tsx                Entry point
│   ├── App.tsx                 Root component
│   ├── index.css               Styles
│   ├── components/             React components
│   ├── hooks/
│   └── services/               2-line shims → frontend/api
│
├── index.html
├── vite.config.ts              (locked)
├── package.json                (locked)
└── tsconfig.json               includes src + frontend + backend
```

## Dependency direction

```
components  →  src/services (shim)  →  frontend/api  →  backend/index  →  backend/services
```

Dependencies only ever point **downward**. The backend never imports anything
from `src/` or `frontend/`, so it can be lifted out into a standalone Node
service without modification.

## Why components remain in `src/`

`vite.config.ts` and `package.json` are locked in this project. Vite's root and
the `@ → src` alias are defined there, and `index.html` loads `/src/main.tsx`.
Moving the components would require editing the build config, so `src/` stays as
the Vite source root while all **backend logic has been fully extracted** into
`backend/`.

## Verification

`npm run build` produces the same bundle as before the split — the refactor is
purely structural, with zero behavioural or visual changes.
