FROM node:latest
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/public
RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server
RUN npm install -g nodemon
COPY ./project/server/package.json /usr/src/app/server
RUN npm install
COPY ./project/public /usr/src/app/public
COPY ./project/server /usr/src/app/server
EXPOSE 3000
CMD ["npm", "start"]