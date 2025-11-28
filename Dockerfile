##############################
# Multi-stage Dockerfile for Next.js (Cloud Run)
##############################

FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development

# Install build dependencies
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built assets and public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT 8080
EXPOSE 8080

# Start Next.js server on provided port
CMD ["sh", "-c", "npm start -- -p $PORT"]
##############################
# Multi-stage Dockerfile for Next.js (Cloud Run)
##############################

FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built assets and public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT=8080
EXPOSE 8080

# Start Next.js server on the provided port
CMD ["sh", "-c", "npm start -- -p ${PORT}"]
##############################
# Multi-stage Dockerfile for Next.js (Cloud Run)
##############################

FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies (including dev) for building
COPY package.json package-lock.json ./
RUN apk add --no-cache --virtual .gyp python3 make g++ \
  && npm ci \
  && apk del .gyp

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy only the built assets and public files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT 8080
EXPOSE 8080

CMD ["sh", "-c", "npm start -- -p $PORT"]
