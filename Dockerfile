FROM node:20-slim

WORKDIR /app

COPY package* .
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]