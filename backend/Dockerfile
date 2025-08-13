# FROM node

# ENV NODE_ENV=production 
# ENV PORT=5000


# RUN mkdir -p backend

# COPY . /backend
# RUN npm install



# CMD ["node" , "/backend/server.js"]


# Use a lightweight Node.js image
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Set working directory inside the container
WORKDIR /backend

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy backend source code
COPY . .

# Generate Prisma client for Linux inside the container
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
