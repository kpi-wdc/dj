FROM dockerfile/nodejs
MAINTAINER Oleksandr Sochka "sasha.sochka@gmail.com"

COPY . /app

# Set production settings
ENV PRODUCTION true
ENV NPM_CONFIG_PRODUCTION true

RUN cd /app; npm install

ENV PORT 80
EXPOSE 80

WORKDIR /app
CMD ["node", "app.js", "--prod"]

