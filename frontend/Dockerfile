FROM node:18-alpine

WORKDIR /app

# Linux compatibility ke liye zaroori libraries
RUN apk add --no-cache libc6-compat

# Network access ke liye zaroori
ENV HOSTNAME="0.0.0.0"

COPY package*.json ./
RUN npm install

COPY . .

# Build time par Backend URL set karein
ARG NEXT_LOCAL_BACKEND_URL
ENV NEXT_LOCAL_BACKEND_URL=$NEXT_LOCAL_BACKEND_URL

# Production build banayein (Ye binaries issue solve karega)
RUN npm run build

EXPOSE 3000

# Production server start karein
CMD ["npm", "start"]