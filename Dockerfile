FROM node:20-alpine AS build

WORKDIR /api

COPY package*.json ./

RUN npm ci
# RUN npm install contracts-green-shop@latest

COPY . .

RUN npm run build 
COPY ./src/integration/email/email/ ./dist/integration/email/email/

FROM node:20-alpine AS prod
WORKDIR /api

COPY --from=build /api ./

RUN chmod +x /api/entrypoint.sh

CMD ["/api/entrypoint.sh"]