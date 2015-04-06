FROM dockerfile/nodejs
MAINTAINER Oleksandr Sochka "sasha.sochka@gmail.com"

#RUN apt-get install -y npm nodejs
#RUN npm install -g npm
#RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN mkdir -p /data/db # mongodb data directory
COPY . /app

RUN cd /app; npm install

ENV PORT 8080
EXPOSE 8080

WORKDIR /app
CMD ["node", "app.js"]

