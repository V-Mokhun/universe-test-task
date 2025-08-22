# server/Dockerfile

# --- 1. Base Stage ---
FROM node:22-bookworm AS base
WORKDIR /app

# --- 2. Dependencies Stage ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

# --- 3. Builder Stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json ./

COPY src ./src/
COPY prisma ./prisma
COPY scripts ./scripts

RUN npm run db:generate

RUN npm run build

RUN cp -R src/generated dist/generated

# --- Development Stage ---
FROM deps AS development

RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/prisma ./prisma
COPY package.json .
COPY tsconfig.json ./

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs

RUN chown -R expressjs:expressjs /app

USER expressjs

COPY --chown=expressjs:expressjs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]


# --- 4. Production Dependencies Stage ---
FROM base AS production-deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# --- 5. Final Runner Stage ---
FROM base AS runner
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist

COPY --from=production-deps /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma
COPY package.json .

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
RUN chown -R expressjs:expressjs /app
USER expressjs

COPY --chown=expressjs:expressjs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["node", "dist/index.js"]
