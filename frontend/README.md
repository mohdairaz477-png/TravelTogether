# Frontend — TravelTogether

## The backend boundary

```
frontend/
└── api/
    └── index.ts    # The ONLY bridge between UI and backend
```

Every piece of data the UI needs flows through `frontend/api`. It currently
re-exports the local `backend/` module. When you switch to a real server, this
one file becomes `fetch()` calls and **nothing else changes**.

```ts
// Recommended import style for new code
import { db, locationService } from '../../frontend/api';
import type { User, Trip } from '../../frontend/api';
```

## Where the UI components live

React components stay under `src/` because Vite's entry point is hard-wired in
`vite.config.ts` (`root`, `@ → src` alias) and `index.html`
(`<script src="/src/main.tsx">`). Those two files are locked in this project,
so `src/` remains the Vite source root.

```
src/
├── main.tsx                 # Vite entry (required location)
├── App.tsx                  # Root component + routing/view state
├── index.css                # Tailwind + design tokens + animations
├── components/
│   ├── App/                 # Logged-in app screens
│   │   ├── AdminPanel.tsx
│   │   ├── AuthModal.tsx
│   │   ├── Chat.tsx
│   │   ├── ConnectionRequests.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── Matches.tsx
│   │   ├── Profile.tsx
│   │   ├── Trips.tsx
│   │   └── UserProfileView.tsx
│   └── *.tsx                # Public landing page sections
├── hooks/
└── services/                # ← thin shims that forward to frontend/api
```

`src/services/*.ts` contain **no logic** — they are 2-line re-exports kept so
existing imports (`../../services/db`) keep working. All real logic is in
`backend/`.

## Data flow

```
React component
   └─► src/services/*  (shim)
          └─► frontend/api        ← swap this for HTTP when you add a server
                 └─► backend/services/*
                        └─► backend/data + localStorage
```
