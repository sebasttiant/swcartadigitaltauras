# Design: DB-backed menu + admin panel (Cluvi-style)

## Intent

Turn the fixture-backed premium menu into a database-driven product with a
friendly admin panel to manage brands, categories, dishes, variants and images,
mirroring the proven Reservas Tauras stack, fully isolated on the shared VPS.

## Stack (mirrors Reservas Tauras)

- PostgreSQL `postgres:18-alpine` (latest, same as Reservas).
- Prisma `7.8.0` + `@prisma/adapter-pg` + `pg` (driver-adapter client).
- Auth: `bcryptjs` (cost 12) + `jose` (HS256 JWT in an httpOnly cookie),
  `middleware.ts` route protection, `sessionVersion` revocation, DB-backed
  `LoginAttempt` rate limiting.
- `tsx` for the seed script.

## VPS isolation (must not collide with Reservas)

| Concern | Reservas | Carta Digital |
|---|---|---|
| Compose project | `reservastauras-next` | `swcartadigitaltauras_preview` |
| App host port | 3330 | **3331** |
| Postgres host port | not published (internal) | **not published in prod** (internal `db:5432`); dev publishes 5433 |
| Volumes | project-prefixed | project-prefixed (distinct) |
| DB name/user | its own | its own (`cartadigital`) |

## Data model (Prisma)

- `Admin(id, email @unique, passwordHash, name, role, isActive, sessionVersion, timestamps)`
- `LoginAttempt(id, emailKey, ipKey?, success, reason?, createdAt)`
- `Brand(id, slug @unique, name, tagline?, whatsappPhone, address?, isActive, sortOrder)`
- `Category(id, brandId→Brand, slug, nameEs, nameEn?, sortOrder)`
- `MenuItem(id, categoryId→Category, nameEs, nameEn?, descEs?, descEn?, price?, currency, available, imageUrl?, features MenuFeatureKind[], sortOrder)`
- `MenuItemVariant(id, itemId→MenuItem, labelEs, labelEn?, price, sortOrder)`
- enum `MenuFeatureKind { premium_meat, cocktail, recommended }`
- enum `AdminRole { SUPER_ADMIN, MENU_EDITOR }`

A repository maps DB rows onto the EXISTING public DTO contract
(`MenuLocation/MenuCategory/MenuItem`) so the public UI is unchanged.

## Real seed data (from Reservas)

- TAURAS Steakhouse — El Poblado, Medellín — wa `573135398147`
- TAURAS Bar & Lounge — El Poblado (piso 2) — wa `573135398147`
- TAURAS Tex Mex — Las Palmas, Mall Indiana — wa `573117050330`
- Admin `admin@ilasesorias` (password hash from `.env.local`, never committed)
- Curated dishes from the current fixtures.

## Network constraint

Prisma downloads engines at generate time and `prisma migrate` needs a live DB.
The sandbox blocks container egress, so: engines/generate run on the host;
Postgres runs as a container (daemon can pull the image); the dev app container
connects to Postgres over the internal compose network. Production build is
validated in CI / on the VPS.

## Testing (TDD)

Unit: session token roundtrip, credential verification (timing-safe), rate-limit
policy (injected clock), repository DB→DTO mapping. Integration where a test DB
is available. Public menu component tests already cover rendering.
