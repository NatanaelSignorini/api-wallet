FROM node:20.17-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN npm i -g yarn --force

RUN yarn --frozen-lockfile

COPY . .

CMD "yarn" "run" "start:dev"