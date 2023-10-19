FROM node:18-alpine3.17

RUN mkdir secrets
RUN echo $SKRIN_BORANG_CONFIG > secrets/config.js

COPY . ./

RUN npm ci --only=production

WORKDIR client
RUN yarn
RUN yarn build

WORKDIR ..

CMD [ "npm", "start" ]