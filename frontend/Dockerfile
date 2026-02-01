# ---- Base ----
FROM node:22-slim AS base

# Enable pnpm via Corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Declare the build argument
ARG VITE_BACKEND_URL
# Make it available to the environment
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN corepack enable
WORKDIR /app

# ---- Dependencies Layer ----
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile && pnpm approve-builds

# ---- Build Layer ----
FROM base AS builder
WORKDIR /app

# Re-declare ARG in this stage so it's available here too

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV UV_THREADPOOL_SIZE=8

RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env

RUN pnpm build

# ---- Runtime Layer ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    mkdir -p /app/data && \
    chown -R nodejs:nodejs /app

COPY --from=builder /app/.output ./.output

USER nodejs
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
