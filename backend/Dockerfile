FROM mhart/alpine-node:12

WORKDIR /usr/src/backend

COPY ./package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000

CMD ["node", "index.js"]
