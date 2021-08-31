FROM node:14.16.0-alpine
EXPOSE 3000 9229

WORKDIR /home/app

COPY package.json /home/app/

RUN npm i -g typeorm
RUN npm i

COPY . /home/app

CMD ["npm", "run", "start:docker"]
