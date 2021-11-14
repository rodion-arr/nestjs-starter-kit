# Node API

## Getting started
```bash
git clone https://github.com/rodion-arr/node-enterprise-api.git

# run docker containers (DB, Redis, etc) 
cd node-enterprise-api/.docker-node-api
docker-compose up -d

# go to api folder and copy env file
cd ../api
cp .env.example .env

# install dependencies
npm ci

# init config and run migrations 
npm run migrations:init
npm run migrations:up

# run application
npm start
```
