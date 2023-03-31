 FROM node:latest

 RUN mkdir -p /app
 WORKDIR /app

 COPY package.json /app
 RUN yarn

 COPY . /app

 EXPOSE 7500

 ENTRYPOINT ["node"]

 CMD ["app.js"]