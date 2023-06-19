# FROM node:16-alpine as build
# WORKDIR /app
# COPY . /app
# RUN npm install
# RUN npm run build

# FROM ubuntu
# RUN apt-get update
# RUN apt-get install nginx -y
# COPY --from=build /app/dist /var/www/html/
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]

FROM node:16-alpine as build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
WORKDIR /var/www/html/
RUN rm -rf ./*
COPY --from=build /app/dist /var/www/html/
  EXPOSE 80
CMD ["nginx","-g","daemon off;"]