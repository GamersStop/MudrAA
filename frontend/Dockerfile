FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

ENV HOSTNAME="0.0.0.0" \
    PORT="3000" \
    WATCHPACK_POLLING="true"

EXPOSE 3000

CMD ["npm", "run", "dev"]
