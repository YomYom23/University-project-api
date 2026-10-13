# Versiti API

REST API for the Versiti university/student matching platform. Built with Bun, Express, TypeScript and PostgreSQL, using Prisma Next for typed queries.

The React client is in [university-project-frontend](https://github.com/YomYom23/university-project-frontend).

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/registration` | no | Create a user (`STUDENT`, `UNIVERSITY_REP` or `ADMIN`) and start a session |
| POST | `/auth/login` | no | Verify credentials and start a session |
| POST | `/auth/logout` | no | Clear the session cookie |
| GET | `/auth/status` | yes | Return the signed-in user |
| GET | `/users/me` | yes | Return the user and their student profile, so onboarding can resume |
| PATCH | `/users` | yes | Save the onboarding form so far; accepts partial payloads, one step at a time |

## Design notes

- Passwords are hashed with bcrypt. Responses select an explicit list of public fields, so the hash is never sent to the client.
- The session is a JWT in an httpOnly cookie. The auth middleware also accepts an `Authorization: Bearer` header.
- `PATCH /users` creates the `StudentProfile` row only once step one has supplied the required columns (first name, last name, date of birth). Later steps update it. User and profile writes happen in one transaction.
- Postgres `timestamp` columns decode as strings, because the default decoder depends on `Temporal`, which Bun and Node don't provide.

## Setup

Requires [Bun](https://bun.sh) and PostgreSQL 15 or newer.

```bash
bun install
cp .env.example .env     # then fill in DATABASE_URL and JWT_SECRET
bun run dev              # http://localhost:3000
```

The SQL migrations are in `prisma/migrations/`. The typed contract is `prisma/contract.prisma`; regenerate its emitted files with `bun run contract:emit`.

CORS allows the frontend origin `http://localhost:5173`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign session tokens |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d` |
| `NODE_ENV` | Set to `development` to allow the session cookie over plain HTTP |

## Data model

- `User`: email, hashed password, role, onboarding step
- `StudentProfile`: one per student; GPA, SAT/ACT, major and location preferences, budget range, campus vibes, extracurriculars
- `UniversityProfile`: one per university rep; location, tuition, GPA cutoff, acceptance rate. The table exists, but no endpoint writes to it yet.

Both profiles are one-to-one with `User` and are deleted with it.
