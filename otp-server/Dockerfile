FROM node:10.15.3

WORKDIR /usr/src/app

COPY ./*.json ./

RUN npm install

COPY ./src ./src

RUN mkdir -p /usr/src/app/log

RUN npm run build
