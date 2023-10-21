FROM node:18-alpine3.17

COPY . ./

RUN yarn install --production --frozen-lockfile
RUN yarn install-client
RUN yarn build-client

CMD [ "npm", "start" ]