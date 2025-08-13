# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Final image
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary build output from builder stage
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
