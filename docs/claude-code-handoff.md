# Claude Code Handoff: Premium Digital Menu

Use this prompt from the repository root:

```md
Move to the correct project folder before doing anything:

cd /home/sebastian/Documentos/DEV/TAURAS/cartadigitaltauras/swcartadigitaltauras

You are working on `swcartadigitaltauras`, an independent GitHub repo:
https://github.com/sebasttiant/swcartadigitaltauras.git

This is NOT the Reservas Tauras repo. Do not modify `/home/sebastian/Documentos/DEV/TAURAS/reservastauras-next`. Do not touch Reservas production port `3330`, deploy scripts, containers, database, or VPS runtime.

## Product mission

Build Premium Digital Menu / Carta Digital Tauras as independent sellable software.

It must be:
- beautiful, premium, and appetizing;
- Cluvi-inspired but Tauras-branded;
- mobile-first for Android/iPhone;
- fully responsive with no horizontal overflow;
- visually impactful but not overloaded;
- per-location;
- always-visible English/Spanish switch;
- highlighting premium meats, cocktails, and recommended items;
- using a lightweight local cart;
- handing off the order draft to WhatsApp.

MVP excludes online payments, POS, kitchen workflow, persistent orders, and SaaS billing.

## Read first

Read these SDD artifacts before coding:

- `openspec/changes/premium-digital-menu/exploration.md`
- `openspec/changes/premium-digital-menu/proposal.md`
- `openspec/changes/premium-digital-menu/specs/premium-digital-menu/spec.md`
- `openspec/changes/premium-digital-menu/design.md`
- `openspec/changes/premium-digital-menu/tasks.md`

Treat them as the implementation contract.

## Technology requirements

Use the most modern stable stack available at scaffold time:

- Next.js App Router, latest stable patch.
- React 19, latest stable patch.
- TypeScript strict mode.
- Node.js 24 LTS, target `24.18.0` if Docker/CI support it cleanly.
- pnpm 11.x.
- Vitest for tests.
- Prisma/PostgreSQL later, not in the first slice unless explicitly needed.
- Docker-first delivery.

If a latest patch has compatibility issues, stop and explain before downgrading.

## Operational isolation

The preview must be separate from Reservas:

- target preview port: `3331`
- do not use port `3330`
- use a distinct Docker Compose project name such as `swcartadigitaltauras_preview`
- no dependency on Reservas containers, DB, or deploy path

## Work strategy

Use feature-branch-chain and small PR-sized slices. Do not build the whole product in one commit.

Start with only:

### Phase 0: Scaffold, Runtime, CI

1. Scaffold a Next.js App Router app in this repo.
2. Configure TypeScript strict mode.
3. Align `.nvmrc`, `package.json` engines, Docker base image, and CI around Node 24 LTS.
4. Add scripts: `lint`, `typecheck`, `test`, `build`.
5. Add CI for frozen install, lint, typecheck, test, build.
6. Add Docker/Compose preview defaults using `WEB_PORT=3331`.

Then continue only if the slice is still reviewable:

### Phase 1: RED Domain Foundation

1. Write failing tests first:
   - `src/lib/menu/format.test.ts`
   - `src/lib/menu/whatsapp.test.ts`
2. Implement:
   - `src/lib/menu/types.ts`
   - `src/lib/menu/fixtures.ts`
   - `src/lib/menu/format.ts`
   - `src/lib/menu/whatsapp.ts`
   - `src/lib/i18n/public-menu-dictionary.ts`

Follow RED → GREEN → REFACTOR.

## Hard rules

- No `any`.
- No giant PR.
- No admin in the first slice.
- No Prisma/migrations in the first slice unless asked.
- No payments/POS/kitchen workflow.
- No copying Reservas code blindly.
- Do not claim readiness without running checks.

## Before stopping

Report:

- files changed;
- tests added;
- commands run and outputs;
- chosen exact versions for Next, React, Node, pnpm;
- whether Docker preview uses port `3331`;
- remaining risks;
- whether the diff is still within a reviewable size.
```
