# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A TypeScript Express REST API backend for a university/student matching platform.
Users register as `STUDENT`, `UNIVERSITY_REP`, or `ADMIN`; students and
universities each have a profile (GPA, test scores, budget, tuition, acceptance
rate, etc.) intended for matching. Persistence is PostgreSQL via Prisma.

## Commands

```bash
npm run dev        # Run the real server: nodemon + tsx watching src/, entry src/server.ts (port 3000)
npx prisma generate            # Regenerate the Prisma client into generated/prisma (REQUIRED after schema changes)
npx prisma migrate dev --name <name>   # Create + apply a migration in dev
npx prisma migrate deploy      # Apply existing migrations (no new migration)
npx prisma studio              # Browse the DB
```

There is no build, lint, or test setup. `npm start` (`node ./bin/www`) is dead
express-generator scaffolding — it `require()`s `src/server.ts` as CommonJS,
which fails (the app is ESM and never exports `app`). Always use `npm run dev`.

## Architecture

The active codebase is entirely under `src/` (ESM, `"type": "module"`). Request flow:

```
src/server.ts            # App entry: express app, CORS (origin localhost:5173), JSON/urlencoded, mounts /auth, connectDB(), app.listen(3000)
  └─ src/routes/         # Express routers (authRoutes.ts → /auth/registration, /auth/login, /auth/logout)
       └─ src/controllers/   # Request handlers (authControllers.ts)
            ├─ src/config/db.ts        # Singleton PrismaClient (PrismaPg driver adapter), connectDB/disconnectDB
            └─ src/utils/generateToken.ts  # Signs JWT, sets it as httpOnly "jwt" cookie
  └─ src/middleware/authMIddleware.ts  # Verifies JWT from Authorization: Bearer header OR jwt cookie, attaches req.user
```

`src/middleware/authMIddleware.ts` (filename misspelled — keep it) is the route
guard but is **not yet wired into any route**; auth endpoints are currently
unprotected.

### Prisma / database

- Schema: `prisma/schema.prisma`. Models: `User`, `StudentProfile`,
  `UniversityProfile` (1:1 with User, cascade delete). Enum `UserRole`.
- The client is generated to `generated/prisma/` (gitignored) via the
  `prisma-client` generator, **not** the default `@prisma/client` location.
  Import it from `generated/prisma/...`, e.g. `db.ts` does
  `import { PrismaClient } from "../../generated/prisma/client.js"`.
  After any schema edit, run `npx prisma generate` or imports break.
- Connection uses the `@prisma/adapter-pg` driver adapter with
  `process.env.DATABASE_URL`. The datasource block has no `url`; the URL comes
  from `prisma.config.ts` (CLI) and the adapter (runtime).
- Migrations live in `prisma/migrations/`.

### Conventions / gotchas

- `tsconfig.json` uses `nodenext` + `verbatimModuleSyntax` +
  `allowImportingTsExtensions`. Relative imports carry explicit extensions —
  `.ts` for source files run by tsx, `.js` for the generated Prisma client.
  Match the existing pattern in the file you edit.
- Use `import type { ... }` for type-only imports (verbatimModuleSyntax enforces it).
- No transpile/emit step: tsx executes `.ts` directly (`emitDeclarationOnly` is set).

### Environment variables (`.env`, gitignored)

- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — token lifetime (note: the `.env` key is misspelled
  `JWT_EXPIRES_I`, but the code reads `JWT_EXPIRES_IN`, so it falls back to `"7d"`)
- `NODE_ENV` — gates Prisma query logging and the `secure` cookie flag
