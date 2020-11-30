FROM mhart/alpine-node:12

WORKDIR /usr/src/frontend

COPY ./package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 4200

CMD ["npm", "run", "start:docker"]
