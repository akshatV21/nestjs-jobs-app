# NestJS Jobs App

Welcome to the NestJS Jobs App repository! This is a job posting backend service made in Node.js using the NestJS framework.

## Overview

This application provides a microservice architecture with various services to handle different functionalities of the job posting system. The services included are:

- Auth Service: Responsible for user registration and authentication.
- Payments Service: Integrates with Stripe for payment processing.
- Job Posting Service: Handles operations for job postings and allows users to apply to job postings.
- Notifications Service: Manages notifications related to job postings and uses websockets for real-time updates.
- Chat Service: Provides a messaging system using a websocket gateway.

The application uses MongoDB as the database and Redis for caching. It also utilizes RabbitMQ as the message broker for inter-service communication.

# Features

- **JWT Authentication**: Jsonwebtokens are used for user authentication, ensuring secure access to protected routes.
- **Authorization**: All types of requests (HTTP, TCP, websockets) are authorized to ensure only authenticated users can access the services.
- **Job Postings**: Companies can post multiple job postings, providing detailed information about the job requirements and description.
- **Job Applications**: Users can apply to multiple job postings, expressing their interest in the available positions.
- **Assessments/Assignments**: Companies can assign assessments or assignments to applicants to evaluate their skills and suitability for the job.
- **Payments**: Payments are handled using Stripe integration, allowing secure and convenient payment processing.
- **NestJS Workspace**: The project is organized as a NestJS workspace, making it easy to manage and scale the application.
- **Request and Response Caching**: Redis is used for caching, improving the performance and responsiveness of the application.
- **Target-Locked Endpoints**: Certain endpoints are locked to specific users based on their roles. For example, job posting and assignment creation endpoints are only accessible to companies, while application acceptance and denial endpoints, as well as job application endpoints, are available to users. The Auth Guard ensures that these endpoints are restricted to the appropriate users.


## Prerequisites

- Docker and Docker Compose
- Node.js
- MongoDB
- Redis
- RabbitMQ

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/akshatV21/nestjs-jobs-app.git
```

2. Install dependencies:

```bash
cd nestjs-jobs-app
npm install
```

3. Start the services using docker-compose

```bash
# This command will start all the services, including the database, Redis, and RabbitMQ.
docker-compose up
```

## Access the application

The services should now be running and accessible at the following endpoints:

- Auth Service: http://localhost:8080
- Chat Service: http://localhost:8083
- Notifications Service: Not exposed via NodePort
- Job Posting Service: http://localhost:8081
- Payments Service: Not exposed via NodePort

## Services and Environment Variables

### Auth Service

- PORT: 8080
- MONGO_URI: mongodb://mongo-server/jobs
- JWT_SECRET: secret
- RMQ_URL: amqp://rmq-server:5672
- RMQ_AUTH_QUEUE: AUTH

### Chat Service

- PORT: 8083
- MONGO_URI: mongodb://mongo-server/jobs
- RMQ_URL: amqp://rmq-server:5672
- RMQ_AUTH_QUEUE: AUTH
- RMQ_CHAT_QUEUE: CHAT
- RMQ_NOTIFICATIONS_QUEUE: NOTIFICATIONS
- REDIS_HOST: redis-server
- REDIS_PORT: 6379

### Notifications Service

- RMQ_URL: amqp://rmq-server:5672
- RMQ_AUTH_QUEUE: AUTH
- RMQ_JOBS_QUEUE: JOBS
- RMQ_NOTIFICATIONS_QUEUE: NOTIFICATIONS
- REDIS_HOST: redis-server
- REDIS_PORT: 6379

### Job Posting Service

- PORT: 8081
- MONGO_URI: mongodb://mongo-server/jobs
- RMQ_URL: amqp://rmq-server:5672
- RMQ_AUTH_QUEUE: AUTH
- RMQ_JOBS_QUEUE: JOBS
- RMQ_PAYMENTS_QUEUE: PAYMENTS
- RMQ_NOTIFICATIONS_QUEUE: NOTIFICATIONS
- REDIS_HOST: redis-server
- REDIS_PORT: 6379

### Payments Service

- RMQ_URL: amqp://rmq-server:5672
- RMQ_AUTH_QUEUE: AUTH
- RMQ_PAYMENTS_QUEUE: PAYMENTS
- STRIPE_SECRET_KEY: stripe-secret-key

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

Please note that the code blocks in the Markdown file are indented by four spaces for proper formatting.
