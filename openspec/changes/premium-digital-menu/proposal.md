# Proposal: Premium Digital Menu

## Intent

Create an independent premium digital menu web app for Tauras that can later become sellable software. It must replace the current PDF/flipbook experience with a mobile-first, bilingual, visually compelling, Cluvi-inspired experience that drives appetite and visit intent.

## Goals

- Mobile-first Android/iPhone experience with no overflow or broken layout.
- Beautiful, appetizing, visually impactful UI without overloading the user.
- Per-location menu discovery.
- Always-visible English/Spanish language switch.
- Featured premium meats, cocktails, and recommended items.
- Lightweight local cart.
- WhatsApp handoff with a readable order summary.
- Independent repo, runtime, port, and deploy path from Reservas Tauras.

## Non-Goals

- Online payments.
- POS/kitchen management.
- Persistent order tracking.
- Full SaaS billing/multi-tenant plans in MVP.
- Touching or changing Reservas Tauras production behavior.

## Capabilities

### New Capabilities

- `premium-digital-menu`: Mobile-first bilingual per-location menu, featured content, local cart, and WhatsApp handoff.
- `preview-runtime-isolation`: Run the menu preview separately from Reservas production.

### Modified Capabilities

- None. This is a new independent product repo.

## Scope and First Slice

- Scaffold modern Next.js App Router app with TypeScript strict mode.
- Align runtime versions: Node 24 LTS, pnpm 11.x, latest stable Next/React patch available.
- Create menu domain types, fixtures, formatting, bilingual fallback, and WhatsApp URL builder.
- Add tests before implementation.
- Defer persistence/admin/images until the public experience contract is stable.

## Success Criteria

- Mobile viewports do not horizontally overflow.
- Menu is clearly appetizing and highlights premium meats/cocktails/recommendations.
- Language switch affects visible UI and WhatsApp summary.
- Cart remains local and sends the correct WhatsApp message.
- Preview runs on a port different from Reservas, target `3331`.
- CI validates lint, typecheck, tests, and build.

## Rollback / Safety

Because this is an independent repo/runtime, rollback is stopping the preview container or reverting the feature branch. Reservas Tauras on port `3330` must remain unaffected.
