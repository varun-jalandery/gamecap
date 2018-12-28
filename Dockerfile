# Install PM2
FROM node:8
RUN npm install -g pm2
WORKDIR /code
COPY . /code
RUN npm install --verbose

