FROM node:24.11.0-alpine

WORKDIR /app

ENV HOSTNAME="0.0.0.0"

# Ye line zaroori hai Next.js compiler errors fix karne ke liye
RUN apk add --no-cache libc6-compat

COPY package*.json .

RUN npm install

COPY . .

# Environment variable build time par pass karne ke liye
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 2: Serve with Nginx (Production standard)
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]