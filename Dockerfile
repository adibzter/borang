FROM node:18-alpine3.17

COPY . ./

RUN npm ci --only=production

WORKDIR client
RUN yarn
RUN yarn build

WORKDIR ..

CMD [ "npm", "start" ]