
# Stage 1: Build backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

# Install dependencies
RUN npm ci

# Copy backend source
COPY server ./server

# Compile TypeScript
RUN npm run build --workspace=server


# Stage 2: Install production dependencies
FROM node:22-alpine AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN npm ci --omit=dev


# Stage 3: Production image
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=production-deps /app/server/package.json ./server/package.json
COPY --from=builder /app/server/dist ./server/dist

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/dist/index.js"]
