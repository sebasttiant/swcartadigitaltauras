# Exploration: Premium Digital Menu

## Current State

The Carta Digital is now treated as an independent sellable software product, not a module inside Reservas Tauras. Reservas remains useful as a reference for business knowledge, CI/CD discipline, Docker-first deployment, bilingual behavior, and operational safety, but this repo owns the new app.

The new repo currently starts from a minimal README. Product and technical planning from the Reservas session has been migrated here so implementation can continue without re-running SDD.

## Product Direction

- Replace Tauras' current PDF/flipbook menu experience with a premium, app-like, mobile-first menu.
- The menu must be beautiful, restrained, appetizing, and visually memorable.
- It must work primarily on Android/iPhone; no horizontal overflow or broken small-screen layout is acceptable.
- MVP includes per-location menus, English/Spanish switching, featured premium meats/cocktails/recommendations, local cart, and WhatsApp handoff.
- MVP excludes online payments, POS, kitchen workflow, persistent orders, and multi-tenant SaaS billing.

## Architecture Options

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Same repo as Reservas | Reuses code fastest | Product coupling and future extraction risk | Rejected after user clarified it may be sold separately |
| New independent repo | Clean product boundary, sellable software foundation | More setup upfront | Chosen |
| Static-only menu | Fast visual validation | Weak future admin/data path | Use only as early fixture strategy |

## Recommended Approach

Build `swcartadigitaltauras` as an independent Next.js App Router app using the latest stable stack available at scaffold time. Keep the first implementation fixture-backed and TDD-driven, then add persistence/admin/images in chained PRs.

## Delivery Principles Carried from Reservas

- Docker-first runtime alignment across local, CI, and preview deploy.
- Small PRs around the 400 changed-line review budget.
- Strict TDD: RED → GREEN → REFACTOR.
- CI minimum effective checks: install, lint, typecheck, tests, build.
- Preview port `3331`, never Reservas production port `3330`.
- Fail-fast deploy scripts only after mutable data exists.

## Risks

- Mobile visual quality is the highest product risk.
- High-quality food imagery can damage performance if not constrained.
- Building SaaS too early would distract from the first sellable demo.
- Copying Reservas scripts blindly would import assumptions that do not exist yet.

## Ready for Proposal

Yes. Continue from the migrated proposal/spec/design/tasks in this repo.
