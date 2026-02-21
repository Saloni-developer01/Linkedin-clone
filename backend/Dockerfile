FROM node:24.11.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# .env file ko copy karne ki zaroorat nahi agar aap Docker Compose use kar rahi hain
EXPOSE 9090

CMD ["npm", "run", "prod"]