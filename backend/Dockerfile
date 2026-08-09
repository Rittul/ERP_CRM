FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./

RUN npm ci

COPY prisma ./prisma


RUN npx prisma generate


COPY src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]