
# Books Backend API

This project is a RESTful API built with NestJS, MongoDB, and Redis. It allows management of books, users, and recommendations.

## Prerequisites

- Node.js >= 20
- npm >= 10 (or pnpm)
- Docker (for databases)

## Required Services

You must have the following Docker containers running:

### MongoDB

```
docker run -d --name books-mongo -p 27017:27017 mongo:latest
```

### Redis

```
docker run -d --name books-redis -p 6379:6379 redis:latest
```

## Environment Variables

Create a `.env` file in the project root with the following content:

```
MONGO_URI=mongodb://localhost:27017/books
JWT_SECRET=put-a-secure-secret-here
```

- `MONGO_URI`: MongoDB connection URL (should match the container port)
- `JWT_SECRET`: Secret key for signing and verifying JWTs

## Ports Used

- API HTTP: `3000`
- MongoDB: `27017`
- Redis: `6379`

## Installation

```bash
npm install
# or
pnpm install
```

## Running in Development

```bash
npm run start:dev
```

## Running in Production

```bash
npm run build
npm run start:prod
```

## Testing

```bash
npm run test
```

## Notes

- Make sure MongoDB and Redis containers are running before starting the API.
- The recommendation microservice uses Redis as a transport.
- The project uses environment variables for sensitive configuration.
