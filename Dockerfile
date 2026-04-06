# Stage 1: Build the React client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Stage 2: Run the Node.js server
FROM node:20-alpine
# Install build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server source code
COPY server ./server/

# Copy built client from stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Expose the application port
EXPOSE 8000

# Set environment to production
ENV NODE_ENV=production

# Start the application
WORKDIR /app/server
CMD ["npm", "start"]
