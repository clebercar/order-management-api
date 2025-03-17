<div align="center">

# 🛍️ Order Management API

A robust NestJS-based REST API for managing orders and products with automated stock control

[![NestJS][nestjs-shield]][nestjs-url]
[![TypeScript][typescript-shield]][typescript-url]
[![PostgreSQL][postgresql-shield]][postgresql-url]
[![Docker][docker-shield]][docker-url]
[![License: MIT][license-shield]][license-url]

</div>

## ✨ Features

- 📦 **Product Management** - Complete CRUD operations
- 🛒 **Order Processing** - With real-time stock validation
- 🔄 **Status Workflow** - Automated order lifecycle (pending → completed/cancelled)
- 📊 **Stock Control** - Automatic inventory management
- 📚 **OpenAPI Documentation** - Interactive API docs with Swagger
- 🐳 **Docker Support** - Containerized deployment ready
- 🗃️ **PostgreSQL Database** - Robust data persistence

## 🚀 Getting Started

### Prerequisites

- 🐳 Docker and Docker Compose
- 📦 Node.js 22+
- 🧶 Yarn (recommended)

### 🐳 Running with Docker

1. Clone the repository
2. Build and start the application:

```bash
# Build and start services
docker compose up --build

# Or run in detached mode
docker compose up -d

# View logs
docker compose logs -f
```

This will start:

- 🗃️ PostgreSQL database (port 5432)
- 🚀 API service (port 3000)

### 💻 Running Locally

```bash
# Install dependencies
yarn

# Setup environment
cp .env.example .env

# Start development server
yarn start:dev
```

## 📚 API Documentation

### OpenAPI (Swagger)

Access the interactive API documentation at:

```
http://localhost:3000/api
```

### Postman Collection

Import our ready-to-use Postman collection:

```
./thera-consulting.postman_collection.json
```

## 🛣️ API Endpoints

### Products

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | `/products`     | List all products   |
| POST   | `/products`     | Create a product    |
| GET    | `/products/:id` | Get product details |
| PATCH  | `/products/:id` | Update a product    |
| DELETE | `/products/:id` | Delete a product    |

### Orders

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/orders`            | List all orders     |
| POST   | `/orders`            | Create an order     |
| GET    | `/orders/:id`        | Get order details   |
| PATCH  | `/orders/:id/status` | Update order status |

## ⚙️ Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orders"
PORT=3000
```

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Generate coverage report
yarn test:cov

# Run unit tests on the docker environment
docker exec -it order_management_api yarn test

# Generate coverage report on the docker environment
docker exec -it order_management_api yarn test:cov
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- MARKDOWN LINKS & BADGES -->

[nestjs-shield]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[nestjs-url]: https://nestjs.com/
[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[postgresql-shield]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[postgresql-url]: https://www.postgresql.org/
[docker-shield]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge
[license-url]: https://opensource.org/licenses/MIT
