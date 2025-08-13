# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT

# Set environment variables inside the container
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=$NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT

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
