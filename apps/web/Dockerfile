# RanchOS web (Next.js 16) runtime image. Build context is the repo root.
FROM node:20-bookworm-slim

WORKDIR /app

# Workspace manifests first for dependency-layer caching.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/i18n/package.json packages/i18n/package.json
COPY packages/redis/package.json packages/redis/package.json
COPY packages/shared/package.json packages/shared/package.json

# --ignore-scripts avoids native/postinstall steps from the unused mobile workspace.
RUN npm ci --ignore-scripts

COPY . .

# NEXT_PUBLIC_* are inlined into the client bundle at build time.
# NEXT_PUBLIC_APP_URL must be the browser-facing web origin (auth client baseURL).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL=http://api:3001
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace web

ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app/apps/web
# next.config rewrites read NEXT_PUBLIC_API_URL at runtime to proxy /api/* to the API.
CMD ["npx", "next", "start", "-p", "3000"]
