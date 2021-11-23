# Node API

[![test](https://github.com/rodion-arr/node-enterprise-api/workflows/Test/badge.svg)](https://github.com/rodion-arr/node-enterprise-api/actions?query=workflow%3A%22Test%22) [![codecov](https://codecov.io/gh/rodion-arr/node-enterprise-api/branch/main/graph/badge.svg?token=NGR0C23CMW)](https://codecov.io/gh/rodion-arr/node-enterprise-api)

## Getting started
```bash
git clone https://github.com/rodion-arr/node-enterprise-api.git

# run docker containers (DB, Redis, etc) 
cd node-enterprise-api/.docker-node-api
docker-compose up -d

# go to api folder and copy env file
cd ../api
cp .env.example .env

# update .env file with credentials

# install dependencies
npm ci

# init config and run migrations 
npm run migrations:init
npm run migrations:up

# run application
npm start
```
