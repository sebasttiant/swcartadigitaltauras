# Tasks: DB-backed menu + admin panel

Delivery: feature-branch-chain, reviewable slices, RED→GREEN→REFACTOR.

## Phase 1 — DB foundation + admin auth (branch feat/admin-auth) — DONE
- [x] 1.1 Prisma schema (Admin, LoginAttempt, Brand, Category, MenuItem, MenuItemVariant, MenuItemImage, Promotion, enums)
- [x] 1.2 `src/lib/db.ts` (PrismaClient + PrismaPg adapter, lazy singleton)
- [x] 1.3 Initial migration + `prisma generate` (URL now in `prisma.config.ts` per Prisma 7)
- [x] 1.4 Seed: admin (hash from env) + 3 real brands + curated dishes/variants/promotions
- [x] 1.5 Auth using DB (signIn queries Admin, sessionVersion, DB LoginAttempt rate-limit)
- [x] 1.6 `src/proxy.ts` (Next 16 rename of middleware) protecting `/admin/*`; `/admin/login` + server actions; protected `/admin`
- [x] 1.7 Docker: `db` service (postgres:18-alpine) in compose (prod internal-only) + dev variant publishing 5433
- [x] 1.8 Tests: session, credentials, rate-limit policy (TDD, 15 tests green)

## Phase 2 — Public menu reads from DB
- [ ] 2.1 Repository mapping Brand/Category/MenuItem → existing DTO contract
- [ ] 2.2 `/menu` loads from DB (fixtures become seed/test source)
- [ ] 2.3 Tests: repository mapping + graceful empty/unavailable states

## Phase 3 — Admin CRUD UI (Cluvi-style, friendly & pretty)
- [ ] 3.1 Brands: list/create/edit/toggle/reorder
- [ ] 3.2 Categories: CRUD + reorder per brand
- [ ] 3.3 Dishes: CRUD, variants, features, availability, price
- [ ] 3.4 Image upload (stable dimensions) writing MenuItem.imageUrl
- [ ] 3.5 Polished admin UX: responsive, optimistic feedback, validation, empty states
- [ ] 3.6 E2E happy paths (later)

## Notes
- Postgres never published to host in production; app talks to `db:5432` internally.
- No collision with Reservas on the VPS (distinct project, ports, volumes, DB).
