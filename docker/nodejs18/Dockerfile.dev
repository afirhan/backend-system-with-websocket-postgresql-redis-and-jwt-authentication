FROM node:18-alpine

LABEL maintainer="Firhan Ali <alifirhan.fa@gmail.com>"
LABEL description="Node.js Application for Threatmap Backend"

WORKDIR /app

# Copy application files
COPY backend/package*.json .
RUN npm install
COPY backend .

# Start Redis and Node.js application
CMD ["npm", "start"]