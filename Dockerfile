# syntax=docker/dockerfile:1

# ---- Base stage ----
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# ---- Dependencies stage ----
FROM base AS deps
COPY package.json ./
RUN npm install --omit=dev

# ---- Development stage ----
FROM base AS development
ENV NODE_ENV=development
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3030
CMD ["npm", "run", "dev"]

# ---- Production stage ----
FROM base AS production
ENV NODE_ENV=production
# Copy installed production deps
COPY --from=deps /app/node_modules ./node_modules
# Copy application source
COPY . .
# Drop privileges
USER node
EXPOSE 3030
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
