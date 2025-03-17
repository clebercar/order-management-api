FROM node:22-alpine

WORKDIR /usr/src/app

COPY .env.example .env

COPY . .

RUN apk -U upgrade && \
  yarn && yarn build

EXPOSE 3000

CMD ["yarn", "start:dev"] 