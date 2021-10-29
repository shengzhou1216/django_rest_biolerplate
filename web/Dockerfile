FROM node:16.6.2

WORKDIR /web-app/
COPY . .

RUN yarn install --registry=https://registry.npm.taobao.org
RUN yarn build:prod

FROM nginx:alpine
LABEL MAINTAINER="zhousheng1216@sina.com"

COPY nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=0 /web-app/dist /usr/share/nginx/html
RUN cat /etc/nginx/nginx.conf
RUN cat /etc/nginx/conf.d/my.conf
RUN ls -al /usr/share/nginx/html