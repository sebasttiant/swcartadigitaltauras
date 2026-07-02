# Carta Digital Tauras

Premium, bilingual, mobile-first **digital menu** for Tauras — an independent,
sellable product. Guests browse an appetizing per-brand menu, build a local
cart, and hand the order off to WhatsApp. No online payments, POS, or kitchen
workflow: it drives appetite and visit intent.

> Independent from **Reservas Tauras**. It has its own repo, runtime, port, and
> deploy path, and must never touch Reservas (port `3330`) on the shared VPS.

## Status

**On `main` (shipped & green):**

- Next.js 16 App Router + React 19 + TypeScript (strict) scaffold, CI, Docker preview.
- Public `/menu`: server-rendered, mobile-first, three Tauras brands, featured
  sections, bilingual (ES/EN) switch, unavailable/empty states.
- Local cart island + WhatsApp hand-off.
- Premium design system: Tauras palette (wine / gold / cream), self-hosted
  Playfair Display, real responsive layout (mobile / tablet / desktop).
- Real curated menu data across Steakhouse, Bar & Lounge, Tex Mex.
- Admin-managed image rendering (`imageUrl`) with a graceful fallback.
- **63 unit tests, lint (0 warnings), typecheck, and build all pass.**

**In progress (branch `feat/admin-auth`, not on `main`):**

- PostgreSQL + Prisma foundation and admin authentication.
- A friendly Cluvi-style admin CRUD to manage brands, categories, dishes,
  variants and images.
- Plan: `openspec/changes/admin-menu-db/` (design + phased tasks).

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js `16.2.10` (App Router, Turbopack) |
| UI | React `19.2.7`, scoped CSS Modules (no Tailwind) |
| Language | TypeScript `5.9` (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`) |
| Fonts | Playfair Display, self-hosted via `next/font/local` |
| Tests | Vitest `4` + Testing Library + jsdom |
| Runtime | Node `24.18.0` LTS, pnpm `11.9.0` |
| Delivery | Docker (standalone) + Compose, GitHub Actions CI |
| Planned data | PostgreSQL `18-alpine` + Prisma `7.8.0` (`@prisma/adapter-pg`) |

## Requirements

- Node `24.18.0` (see `.nvmrc`) and pnpm `11.x` (`corepack enable`).

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000  (default Next dev port)
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Preview on port 3331

**Production-style image** (needs network to build):

```bash
docker compose up -d --build      # http://localhost:3331/menu
```

**Local dev preview with no in-container network** — runs `next dev` from the
host's `node_modules` (run `pnpm install` on the host first):

```bash
docker compose -f docker-compose.dev.yml up -d   # http://localhost:3331/menu
docker compose -f docker-compose.dev.yml down
```

## Operational isolation (shared VPS)

| Concern | Reservas Tauras | Carta Digital |
|---|---|---|
| Compose project | `reservastauras-next` | `swcartadigitaltauras_preview` |
| App host port | `3330` | **`3331`** |
| Postgres | internal only | internal only in prod (dev publishes `5433`) |

Never use port `3330`; never touch the Reservas repo, DB, containers, or deploy.

## Project structure

```
src/
  app/
    menu/
      page.tsx                 # public menu route (?venue=&lang=)
      _components/             # MenuScreen, MenuItemCard, cart island, ...
    layout.tsx  globals.css    # Tauras theme + fonts
    fonts/                     # self-hosted Playfair Display woff2
  lib/
    menu/                      # types, fixtures, format, whatsapp, cart, view (+ tests)
    i18n/                      # public menu dictionary (ES/EN)
    auth/                      # (WIP) session + credentials primitives
openspec/changes/              # SDD artifacts (premium-digital-menu, admin-menu-db)
```

## Brands

- **Tauras Steakhouse** — El Poblado, Medellín
- **Tauras Bar & Lounge** — El Poblado (2nd floor)
- **Tauras Tex Mex** — Las Palmas, Mall Indiana

## Roadmap

1. **DB foundation + admin auth** — Prisma/Postgres, seed, login (`feat/admin-auth`).
2. **Public menu from DB** — repository maps DB to the existing DTO contract.
3. **Admin CRUD (Cluvi-style)** — manage brands, categories, dishes, images.

See `openspec/changes/admin-menu-db/` for the detailed design and tasks.

## License

Proprietary — Tauras. Internal product, all rights reserved.
