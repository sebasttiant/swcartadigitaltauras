# Tasks: Premium Digital Menu

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,800-2,800 total; target <=400 per PR |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 0 scaffold/runtime/CI -> PR 1 domain foundation -> PR 2 public UI -> PR 3 cart/WhatsApp -> PR 4 data/images -> PR 5 admin/E2E |
| Delivery strategy | feature-branch-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

## Phase 0: Scaffold, Runtime, CI

- [ ] 0.1 Create Next.js App Router app in this repo with TypeScript strict mode and pnpm.
- [ ] 0.2 Align `.nvmrc`, `package.json` engines, Docker base image, and CI to Node 24 LTS target `24.18.0` when available.
- [ ] 0.3 Add scripts: `lint`, `typecheck`, `test`, `build`.
- [ ] 0.4 Add minimal CI workflow for frozen install, lint, typecheck, test, build.
- [ ] 0.5 Add Dockerfile and Compose preview defaults with `WEB_PORT=3331` and a distinct compose project name.

## Phase 1: RED Domain Foundation

- [ ] 1.1 Create failing `src/lib/menu/format.test.ts` for fallback, currency, badges, ordering, and empty states.
- [ ] 1.2 Create failing `src/lib/menu/whatsapp.test.ts` for sede phone, lines, notes, totals, language, and encoding.
- [ ] 1.3 Create `src/lib/menu/types.ts`, `fixtures.ts`, `format.ts`, `whatsapp.ts`, and `src/lib/i18n/public-menu-dictionary.ts` to pass tests.

## Phase 2: RED Public Route and Mobile Shell

- [ ] 2.1 Create failing page/component tests for sede render, language labels, featured sections, and unavailable items.
- [ ] 2.2 Create `src/app/menu/page.tsx` resolving `venue` and `lang`, with safe defaults and metadata.
- [ ] 2.3 Create `MenuHero`, `LanguageSwitch`, `LocationTabs`, `FeaturedMenu`, `CategoryRail`, and `MenuItemCard`.
- [ ] 2.4 Add scoped mobile-first styles: dark/gold, wrapping chips, fixed aspect ratios, no overflow.

## Phase 3: RED Cart and WhatsApp Handoff

- [ ] 3.1 Create failing cart island tests for edits, unavailable blocking, sede scoping, and totals.
- [ ] 3.2 Create a single client cart island with local state.
- [ ] 3.3 Wire `buildWhatsAppMenuUrl()` into the cart CTA and selected language.

## Phase 4: Persistence and Assets Later Slice

- [ ] 4.1 Add Prisma/Postgres only after fixture UI is validated.
- [ ] 4.2 Add catalog queries mapping Prisma records to the existing DTO contract.
- [ ] 4.3 Add menu image upload/optimization with stable dimensions and rollback plan.

## Phase 5: Admin, E2E, and Polish

- [ ] 5.1 Add admin CRUD after persistence, split again if over budget.
- [ ] 5.2 Add mobile Playwright coverage for overflow, language, featured content, cart, WhatsApp.
- [ ] 5.3 Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` before each PR.

## Claude Code Handoff Notes

Start with Phase 0 + Phase 1 only. Use RED-GREEN-REFACTOR, keep changes reviewable, do not touch Reservas Tauras, and do not use port `3330`.
