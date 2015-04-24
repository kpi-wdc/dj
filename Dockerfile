FROM node:0.12-onbuild
MAINTAINER Oleksandr Sochka "sasha.sochka@gmail.com"

COPY . /app

# Set production settings
ENV PRODUCTION true
ENV NPM_CONFIG_PRODUCTION true

WORKDIR /app
RUN npm install
RUN npm run-script postinstall # for some reason this is not called automatically in docker

ENV PORT 80
EXPOSE 80

CMD ["node", "app.js", "--prod"]

