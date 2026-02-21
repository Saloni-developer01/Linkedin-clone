FROM node:24.11.0-alpine

WORKDIR /app

ENV HOSTNAME="0.0.0.0"

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 2: Serve with Nginx (Production standard)
# FROM nginx:stable-alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]