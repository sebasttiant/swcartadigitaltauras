# Status — admin-menu-db

_Snapshot: 2026-07-02. Resume here tomorrow._

## Where we are

- `main` has the complete, green public product (PR #1 merged): premium menu,
  cart, WhatsApp hand-off, responsive design, Docker preview. 63 tests green.
- This change (DB + admin) is **started, not wired**, on branch
  `feat/admin-auth` (pushed to origin, NOT merged to main).

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

## NOT done yet (next session, Phase 1)

1. `prisma/schema.prisma` — Admin, LoginAttempt, Brand, Category, MenuItem,
   MenuItemVariant, enums (MenuFeatureKind, AdminRole).
2. `src/lib/db.ts` — PrismaClient + PrismaPg adapter singleton (mirror Reservas).
3. `prisma migrate dev` + `prisma generate` (run on host; needs a live DB).
4. `prisma/seed.ts` (tsx) — admin (hash from env) + 3 real brands + curated dishes.
5. DB-backed auth: signIn queries Admin, `sessionVersion` revocation,
   `LoginAttempt` rate limiting; `middleware.ts`; `/admin/login` + `/admin`.
6. Docker `db` service (`postgres:18-alpine`) — prod internal-only; dev publishes 5433.
7. TDD: session, credentials, rate-limit policy tests.

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
