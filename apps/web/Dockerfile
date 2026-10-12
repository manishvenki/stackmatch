# -------------------------------------------------------------
# Stage 1: Build Frontend Assets
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifest and workspace package manifests for caching
COPY package.json ./
COPY packages/types/package*.json ./packages/types/
COPY apps/web/package*.json ./apps/web/

# Install workspace dependencies
RUN npm --prefix packages/types ci --ignore-scripts || npm --prefix packages/types install
RUN npm --prefix apps/web ci || npm --prefix apps/web install

# Copy source code
COPY packages/types ./packages/types
COPY apps/web ./apps/web

# Build shared types and web bundle
RUN npm --prefix packages/types run build
RUN npm --prefix apps/web run build

# -------------------------------------------------------------
# Stage 2: Serve with Production Nginx
# -------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
