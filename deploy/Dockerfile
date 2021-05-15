FROM node:12.18.3-alpine

WORKDIR /home/app

ADD package.json /home/app
RUN yarn install
ADD . /home/app

EXPOSE 8000
