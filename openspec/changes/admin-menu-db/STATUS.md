# Status — admin-menu-db

_Snapshot: 2026-07-02. Slice 1 (DB + Auth foundation) COMPLETE — PR #2 open, CI green, awaiting review (NOT merged)._

## Where we are

- `main` has the complete, green public product (PR #1 merged): premium menu,
  cart, WhatsApp hand-off, responsive design, Docker preview.
- Slice 1 (DB + admin) is **done and pushed** on branch `feat/admin-auth`,
  opened as **PR #2** (`feat/admin-auth` → `main`), ready for review.
  CI is green (`verify` + `docker` both pass). Not merged; awaiting human review.

## Slice 1 result (DB + Auth foundation) — DONE

- Prisma 7 schema: Admin, LoginAttempt, Brand, Category, MenuItem,
  MenuItemVariant, MenuItemImage, Promotion + enums. Prisma 7 moved the DB URL
  out of the schema → `prisma.config.ts` holds it; runtime uses the PrismaPg
  adapter in `src/lib/db.ts` (lazy singleton). Initial migration committed.
- DB-backed auth: `signIn` (rate-limited via LoginAttempt, timing-safe creds),
  `getAuthenticatedAdmin` (sessionVersion revocation), session tokens embed
  `sv`. Edge `proxy.ts` (renamed from deprecated `middleware.ts`) guards
  `/admin/*`; `/admin/login` + server actions + protected `/admin`.
- Docker: isolated `postgres:18-alpine` `db` service. Postgres 18 needs the
  volume at `/var/lib/postgresql` (NOT `.../data`) — fixed. Prod internal-only;
  dev publishes 5433.
- Seed: 1 admin (from env hash), 3 real brands + real WhatsApp numbers,
  categories, dishes/cocktails with variants, 2 promotions. Admin, brands and
  categories are upserted; **menu items are delete-then-recreate (NOT
  idempotent for items)** — see the non-destructive-seed follow-up below.
- Migrations in deploy: a `migrate` compose service runs `pnpm db:deploy`
  (`prisma migrate deploy`) after `db` is healthy and before `web` starts. Prod
  never auto-seeds.
- Verified: lint ✅ typecheck ✅ tests ✅ build ✅, local `docker build` ✅,
  Postgres 18.3 healthy ✅, migrate ✅, seed ✅, end-to-end sign-in / revocation
  / rate-limit smoke test ✅. **PR #2 CI green** (`verify` + `docker`).

## Next: Slice 2 — Admin CRUD MVP (only after Slice 1 merged/green)

## Done on `feat/admin-auth`

- Deps aligned to Reservas: `prisma@7.8.0`, `@prisma/client@7.8.0`,
  `@prisma/adapter-pg@7.8.0`, `pg@8.21.0`, `bcryptjs@3.0.3`, `jose@6.2.3`,
  `tsx@4.22.3`. Build scripts approved in `pnpm-workspace.yaml`.
- Auth primitives (framework-agnostic, ready): `src/lib/auth/session.ts`
  (jose HS256 create/verify), `src/lib/auth/credentials.ts` (bcrypt verify with
  timing-safe dummy hash), `src/lib/auth/constants.ts`.
- `.env.local` (gitignored) already holds `ADMIN_EMAIL=admin@ilasesorias`,
  `ADMIN_PASSWORD_HASH` (bcrypt of the real password), `SESSION_SECRET`.
- Design + tasks in this folder.

## Phase 1 checklist — ALL DONE in Slice 1

1. [x] `prisma/schema.prisma` (+ `MenuItemImage`, `Promotion` beyond the design).
2. [x] `src/lib/db.ts` — lazy PrismaClient + PrismaPg adapter singleton.
3. [x] Initial migration (`prisma/migrations/…_init`) + `prisma generate`.
4. [x] `prisma/seed.ts` (tsx) — admin (env hash) + 3 real brands + dishes.
5. [x] DB-backed auth: `signIn`, `sessionVersion` revocation, `LoginAttempt`
       rate limiting; `src/proxy.ts`; `/admin/login` + `/admin`.
6. [x] Docker `db` service (`postgres:18-alpine`) — prod internal-only; dev 5433.
7. [x] TDD: session, credentials, rate-limit policy tests (15 new, green).

## Follow-ups for Slice 2 (from Slice 1 fresh review — design, don't patch)

- **Rate-limit by IP as well as email.** Today `LoginAttempt.ipKey` is always
  null and throttling is per-email only; add a coarse client key so rotating
  emails can't drive unbounded bcrypt work (unauthenticated CPU-DoS).
- **Rate-limit race (TOCTOU).** `signIn` reads attempts then inserts without a
  transaction, so a parallel burst can exceed the ceiling. Enforce atomically
  (SERIALIZABLE/`FOR UPDATE` or an atomic counter).
- **Non-destructive menu seed.** The current seed delete-then-recreates
  `MenuItem` (cascades to images/variants). Move to natural-key `upsert` BEFORE
  the admin panel writes real images/edits, or a re-seed will destroy them.

## Smaller follow-ups noted during Slice 1

- **`.env.example`**: the local tool sandbox blocks writing any `.env*` file, so
  it must be added by hand. Required keys: `WEB_PORT`, `POSTGRES_USER`,
  `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, `SESSION_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (safe placeholders only). Exact content
  is provided in the PR review thread.
- **DB-backed auth integration tests** (`src/lib/auth/service.integration.test.ts`)
  run only when `DATABASE_URL` is set, so they cover inactive-admin, sessionVersion
  revocation and valid-credentials locally but are skipped in the CI `verify` job
  (no Postgres there). Follow-up: add a Postgres service to CI so these run in CI too.
- Public fixtures still use placeholder WhatsApp `573001112233`; the DB seed has
  the real numbers. Reconcile when Slice 4 wires the public menu to the DB.

## Real seed data (from Reservas)

| Brand | Location | WhatsApp |
|---|---|---|
| TAURAS Steakhouse | El Poblado, Medellín | 573135398147 |
| TAURAS Bar & Lounge | El Poblado (piso 2) | 573135398147 |
| TAURAS Tex Mex | Las Palmas, Mall Indiana | 573117050330 |

(Public fixtures still use placeholder `573001112233` — update when Phase 2 reads from DB.)

## VPS isolation (must hold)

Distinct compose project `swcartadigitaltauras_preview`, app port 3331 (never
3330), Postgres internal-only in prod, own DB/volumes. Never touch Reservas.
