# RanchOS API runtime image.
# The API has no compiled build (tsconfig noEmit), so it runs from TS source via tsx.
FROM node:20-bookworm-slim

WORKDIR /app

# Install workspace manifests first for better layer caching on dependency installs.
# All workspaces must be present or `npm ci` will report the lockfile out of sync.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/i18n/package.json packages/i18n/package.json
COPY packages/redis/package.json packages/redis/package.json
COPY packages/shared/package.json packages/shared/package.json

# --ignore-scripts: the API runtime stack is pure JS; skip native/postinstall steps
# pulled in by the mobile (Expo/RN) workspace, which we never run here.
RUN npm ci --ignore-scripts

# Application source.
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

# Apply migrations (idempotent) then start the API.
CMD ["sh", "-c", "npm run db:migrate && npx tsx apps/api/src/index.ts"]
