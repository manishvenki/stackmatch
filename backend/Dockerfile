# -------------------------------------------------------------
# Stage 1: Build Backend & Shared Types
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install native compilation tools for native dependencies if needed
RUN apk add --no-cache python3 make g++

# Copy package manifests for layer caching
COPY package.json ./
COPY packages/types/package*.json ./packages/types/
COPY backend/package*.json ./backend/

# Install build dependencies
RUN npm --prefix packages/types ci --ignore-scripts || npm --prefix packages/types install
RUN npm --prefix backend ci || npm --prefix backend install

# Copy source code
COPY packages/types ./packages/types
COPY backend ./backend

# Build shared types and backend
RUN npm --prefix packages/types run build
RUN npm --prefix backend run build

# -------------------------------------------------------------
# Stage 2: Production Runtime
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install curl for reliable container health checking
RUN apk add --no-cache curl

# Copy package manifests
COPY package.json ./
COPY packages/types/package*.json ./packages/types/
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN npm --prefix backend ci --omit=dev || npm --prefix backend install --omit=dev

# Copy compiled artifacts from builder
COPY --from=builder /app/packages/types /app/packages/types
COPY --from=builder /app/backend/dist /app/backend/dist
COPY --from=builder /app/backend/package.json /app/backend/package.json

EXPOSE 5000

# Container health check against backend API
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

WORKDIR /app/backend

# Execute compiled Express server
CMD ["node", "dist/backend/src/server.js"]
