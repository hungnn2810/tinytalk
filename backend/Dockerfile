# =========================
# Stage 1 — Build the app
# =========================
FROM node:24-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/

# =========================
# Stage 2 — Run in production
# ========================
FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]