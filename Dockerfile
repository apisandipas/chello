FROM oven/bun:1.2-alpine as dev

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "dev"]