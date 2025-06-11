FROM node:20-alpine AS build

WORKDIR /api

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

FROM node:20-alpine AS prod
WORKDIR /api

COPY --from=build /api ./

RUN chmod +x /api/entrypoint.sh

CMD ["/api/entrypoint.sh"]