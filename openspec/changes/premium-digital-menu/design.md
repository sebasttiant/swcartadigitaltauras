# Design: Premium Digital Menu

## Technical Approach

Build an independent Next.js App Router application in this repo. Use a fixture-backed, TDD-first foundation before persistence/admin. Keep the app Docker-first and preview-safe on port `3331`, separate from Reservas Tauras production on `3330`.

## Architecture Decisions

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Repo boundary | Independent `swcartadigitaltauras` repo | Keep inside Reservas | User intends to sell it as another software; separate repo avoids product coupling. |
| Stack | Next.js App Router + React 19 + TypeScript | Vite SPA, plain React | Next gives routing, SSR/RSC, image/meta/build discipline; React handles cart interactions. |
| Runtime | Node 24 LTS, target `24.18.0`; pnpm 11.x | Reuse older versions blindly | Keep current stable/LTS alignment across local, CI, Docker. |
| Data rollout | Typed fixtures first; Prisma/Postgres later | Full DB/admin first | Visual/product validation comes first; admin/data can be sliced later. |
| Cart | Client-only local cart scoped by location | Server order cart | MVP needs WhatsApp intent, not orders/payments/kitchen state. |
| Styling | App-scoped modern CSS/CSS modules or scoped globals | Tailwind by default | Avoid framework churn unless explicitly scaffolded and justified. |

## Data Flow

`/menu?venue=poblado&lang=en` → parse venue/language → load typed fixture/menu DTO → render server UI → client cart island stores local state → WhatsApp URL builder opens selected sede contact.

Future persistence: Prisma catalog tables → server-only queries → same DTO contract → admin CRUD/audit.

## File Plan

| File | Action | Description |
|---|---|---|
| `package.json`, `.nvmrc`, lockfile | Create | Runtime scripts and version alignment. |
| `Dockerfile`, `docker-compose.yml` | Create | Preview-safe web service on `WEB_PORT=3331`; healthcheck after endpoint exists. |
| `.github/workflows/ci.yml` | Create | Install, lint, typecheck, test, build. |
| `src/app/menu/page.tsx` | Create | Public menu route. |
| `src/app/menu/_components/*` | Create | Hero, language switch, venue tabs, featured sections, category rail, item cards, cart drawer. |
| `src/lib/menu/types.ts` | Create | Const-object types for categories, items, variants, options, feature flags. |
| `src/lib/menu/fixtures.ts` | Create | Initial Tauras menu content by location. |
| `src/lib/menu/format.ts` | Create | Bilingual fallback, currency, badges, ordering. |
| `src/lib/menu/whatsapp.ts` | Create | WhatsApp message and URL contract. |
| `src/lib/i18n/public-menu-dictionary.ts` | Create | English/Spanish UI copy. |
| `src/lib/menu/*.test.ts` | Create | Strict TDD unit tests. |

## Interfaces / Contracts

Use DTOs before DB: `MenuLocation`, `MenuCategory`, `MenuItem`, `MenuItemVariant`, `MenuItemOption`, `MenuFeatureKind = premium_meat | cocktail | recommended`.

WhatsApp message contract: greeting, location name, selected language, `qty x name [variant/options] - price`, notes, estimated total when available, and confirmation disclaimer.

## CI/CD and Delivery Strategy

- CI: frozen install, lint, typecheck, test, build.
- Docker Compose: no collision with Reservas; target preview port `3331`.
- Healthcheck only after `/api/health` exists.
- Backups/deploy scripts only after mutable DB state exists.
- Use conventional commits and reviewable work units.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | fallback, currency, ordering, WhatsApp URL/message | Vitest before implementation. |
| Render | language labels, featured content, unavailable/empty states | Component/page tests after scaffold. |
| E2E | mobile overflow, cart, WhatsApp CTA | Later Playwright mobile slice. |

## Migration / Rollout

No data migration in PR 1. Chained PRs: 1) scaffold/runtime/CI + domain tests, 2) public UI, 3) cart/WhatsApp UI, 4) Prisma/data/images, 5) admin/E2E/polish.

## Open Questions

- [ ] Exact Next.js/React patch versions at scaffold time.
- [ ] Final menu source data/images and per-location differences.
- [ ] Whether first public route should be `/menu`, `/carta`, or both.
