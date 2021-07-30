FROM node:14.16.0-alpine
EXPOSE 3000 9229

WORKDIR /home/app

COPY package.json /home/app/

RUN npm i

COPY . /home/app

# RUN npm run build

CMD node index.js
