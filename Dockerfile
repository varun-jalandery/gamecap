# Install PM2
FROM node:8
RUN npm install -g pm2
ADD . /code
WORKDIR /code
RUN npm install