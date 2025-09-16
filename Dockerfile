# Use the official Node.js 18 image with Ubuntu base for better compatibility
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Update system packages and install required tools
RUN apt-get update && \
    apt-get install -y curl wget apt-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]