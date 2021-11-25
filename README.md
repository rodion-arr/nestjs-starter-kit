# Node API

[![test](https://github.com/rodion-arr/node-enterprise-api/workflows/Test/badge.svg)](https://github.com/rodion-arr/node-enterprise-api/actions?query=workflow%3A%22Test%22) [![codecov](https://codecov.io/gh/rodion-arr/node-enterprise-api/branch/main/graph/badge.svg?token=NGR0C23CMW)](https://codecov.io/gh/rodion-arr/node-enterprise-api)

This is a starter kit for typical Nest.js REST API project.

## Motivation

The main goal of this project is to provide fully functional Nest.js app which can be used as a started kit for creating your own REST APIs.

Usually it is not enough to just do `nest new project` and start writing business logic. Nest.js provides a minimal application out of the box with only one controller and service. In most cases it is required to pull and setup a bunch of additional packages from Nest.js ecosystem like `typeorm`, `passport`, `cache-manager`, DTO validators etc.

This repo provides an already configured REST API project with commonly used Nest.js packages (full list below) so you can just copy it and start writing your business logic.

## Features

- Dockerized local development
- Configuration via ENV variables
- Validation via DTO
- DB migrations
- Redis cache
- JWT auth with passport.js
- Graceful shutdown
- Automatic APIs documentation with Swagger
- Unit tests

### Dockerized local development

You are getting fully functional docker environment for development with Postgres DB and Redis. You can spin-up all server dependencies with only 1 command without need of setting up DB and Redis servers manually. Check out [.docker-node-api](./.docker-node-api) folder.

### Configuration via ENV variables

According to [12 factor app](https://12factor.net/config) - it is recommended to store application config in Environment Variables. This technique allows you to build the bundle once and deploy it to multiple target server (e.g. QA, Staging, Prod) without code modifications. Each env will have different configuration values which application retrieves from environment variables.

This project provides a set of config values out of the box e.g. for connecting to DB and Cache server. Check out [app.module.ts](./api/src/app.module.ts#L14) and [configuration.ts](./api/src/services/app-config/configuration.ts) for more details.

### Validation via DTO

Global [ValidationPipeline](./api/src/main.ts) enabled and requests to APIs are validated via [DTO](./api/src/user/dto).  

### DB migrations

`TypeORM` DB migrations are already set up for you in [./api/src/db/migrations](./api/src/db/migrations) folder.

To generate new migration run:

```console
npm run migrations:new -- -d src/db/migrations -n Roles
```

To apply migrations run:

```console
npm run migrations:up
```

To revert migrations run:

```console
npm run migrations:revert
```

### Redis cache

[cache-manager](https://github.com/BryanDonovan/node-cache-manager#readme) with Redis store was set up [app-cache.module.ts](./api/src/app-cache/app-cache.module.ts).

So it is possible to use [`CacheInterceptor`](./api/src/user/user.controller.ts#L50):

```typescript
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUsers() {}
```

Or inject `CacheManager`:

```typescript
constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

await this.cacheManager.get('key');
```

### JWT auth with passport.js

JWT authentication is configured and available to use.

User registration, login and JWT-protected APIs examples were added in [user.controller.ts](./api/src/user/user.controller.ts)  

### Logger with Trace ID generation

[Pino](https://github.com/pinojs/pino) added as application logger.

Each request to API is signed with unique TraceID and passed to logger via [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage).
Code can be found in [async-storage.middleware.ts](./api/src/global/middleware/async-storage/async-storage.middleware.ts) and [app-logger.service.ts](./api/src/logger/services/app-logger/app-logger.service.ts)

<img width="799" alt="TraceID in logs example" src="https://user-images.githubusercontent.com/5843270/143482882-84c51e0e-0e54-407b-8ed7-cf7b8536f7e3.png">

### Graceful shutdown

Nest.js [shutdown hooks](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown) are enabled.

This starter kit subscribed to `OnModuleDestroy` event and [disconnects](./api/src/app-cache/app-cache.module.ts) from Redis gracefully.

### Automatic APIs documentation with Swagger

Nest.js swagger module configured with the use of [Swagger CLI plugin](https://docs.nestjs.com/openapi/cli-plugin).

API docs are generated with the start of app server automatically:

<img width="1485" alt="Swagger doc generated" src="https://user-images.githubusercontent.com/5843270/143483373-a0f3fd48-4f27-4d53-9b8f-6b80bc147d48.png">

### Unit tests

All code added in the project is covered with [unit tests](https://github.com/rodion-arr/node-enterprise-api/search?q=describe).

You can find useful tests example of:
- DB repository mock [(auth.service.spec.ts)](./api/src/user/services/auth/auth.service.spec.ts). Search for `getRepositoryToken`.
- Controller test [(user.controller.spec.ts)](./api/src/user/user.controller.spec.ts)
- Middleware test [(async-storage.middleware.spec.ts)](./api/src/global/middleware/async-storage/async-storage.middleware.spec.ts)
- Service test [(jwt.service.spec.ts)](./api/src/user/services/jwt/jwt.service.spec.ts)

## Installation

### Prerequisites

- Docker for desktop
- Node.js LTS

### Getting started

- Clone the repository 
```console
git clone https://github.com/rodion-arr/node-enterprise-api.git
```

- Run docker containers (DB, Redis, etc)
```console
cd node-enterprise-api/.docker-node-api
docker-compose up -d
```

- Go to api folder and copy env file
```console
cd ../api
cp .env.example .env
```

- Update .env file with credentials

- Next install dependencies
```console
npm ci
```

- Init config and run migrations
```console
npm run migrations:init
npm run migrations:up
```

- Run application
```console
npm start
```
