# syntax=docker/dockerfile:1

# Preview-safe image for Carta Digital Tauras.
# Independent from Reservas Tauras: own build, own runtime, own port (3331).
ARG NODE_VERSION=24.18.0
ARG PNPM_VERSION=11.9.0

FROM node:${NODE_VERSION}-slim AS base
ARG PNPM_VERSION
# Install pnpm via npm instead of `corepack prepare`. Corepack performs its own
# signed tarball download of the pnpm binary at build time, which is a frequent
# failure point behind proxies, mirrors, or strict networks. npm reuses the
# already-configured registry and is more reliable. NPM_CONFIG_REGISTRY lets a
# private mirror be injected at build time (option 2 for restricted networks).
ARG NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@${PNPM_VERSION} \
    && pnpm config set store-dir /pnpm/store --global
WORKDIR /app

# --- Dependencies (cached) ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# --- Runtime (standalone) ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3331
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3331
CMD ["node", "server.js"]
