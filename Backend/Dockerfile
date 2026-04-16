FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/dist/logs/accesslogs

RUN addgroup app && adduser -S -G app app

RUN chown -R app:app /app/dist/logs

USER app

EXPOSE 4000

CMD ["node", "dist/app.js"]