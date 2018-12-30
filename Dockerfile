# Install PM2
FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --verbose
RUN npm install -g pm2
COPY . .
