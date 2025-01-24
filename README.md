# Service Management Application

This repository contains both the backend API and the frontend application for a service management platform. The platform allows users to browse and purchase services and provides sellers with tools to manage their services.

## Table of Contents

- [Features](#features)
- [Backend](#backend)
  - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
    - [User Endpoints](#user-endpoints)
    - [Seller Endpoints](#seller-endpoints)
  - [Dummy Data](#dummy-data)
- [Frontend](#frontend)
  - [Installation](#frontend-installation)
  - [Routes](#frontend-routes)
  - [Reason for Excluding Seller Portion](#reason-for-excluding-seller-portion)
- [License](#license)

---

## Features

- **User Management**: User registration, login, cart management, and purchasing.
- **Seller Management**: Seller registration, login, and service management.
- **Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **Service Management**: CRUD operations for services by sellers.
- **Cart Operations**: Add, remove, view, and purchase services.
- **Frontend Application**: A user-friendly interface for seamless service browsing and cart operations.

---

## Backend

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in a `.env` file:
   ```plaintext
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints

#### User Endpoints

| Method | Endpoint                 | Description                        | Auth Required |
|--------|--------------------------|------------------------------------|---------------|
| POST   | `/user/register`         | Register a new user                | No            |
| POST   | `/user/login`            | User login                         | No            |
| GET    | `/user/services`         | Get all services                   | Yes           |
| POST   | `/user/cart/add`         | Add service to cart                | Yes           |
| POST   | `/user/cart/remove`      | Remove service from cart           | Yes           |
| GET    | `/user/cart/purchase`    | Purchase services in the cart      | Yes           |
| GET    | `/user/getcartItems`     | View all items in the cart         | Yes           |
| POST   | `/user/logout`           | Logout user                        | Yes           |

#### Seller Endpoints

| Method | Endpoint                 | Description                        | Auth Required |
|--------|--------------------------|------------------------------------|---------------|
| POST   | `/seller/register`       | Register a new seller              | No            |
| POST   | `/seller/login`          | Seller login                       | No            |
| POST   | `/seller/create`         | Create a new service               | Yes           |
| GET    | `/seller/services`       | View all services by the seller    | Yes           |
| PUT    | `/seller/services/:id`   | Edit a service                     | Yes           |
| DELETE | `/seller/services/:id`   | Delete a service                   | Yes           |
| GET    | `/seller/logout`         | Logout seller                      | Yes           |

### Dummy Data

#### User Registration
```json
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "mobile": "1234567890",
  "password": "securePassword123"
}
```

#### Seller Registration
```json
{
  "username": "JaneSeller",
  "email": "janeseller@example.com",
  "mobile": "9876543210",
  "password": "sellerPassword123"
}
```

#### Service Creation (by Seller)
```json
{
  "name": "Web Development Service",
  "description": "Professional web development services",
  "price": 5000,
  "img_url": "https://example.com/image.jpg"
}
```

#### Add Service to Cart (by User)
```json
{
  "serviceId": "1234567890abcdef",
  "sellerId": "abcdef1234567890",
  "quantity": 2
}
```

#### Remove Service from Cart
```json
{
  "serviceId": "1234567890abcdef"
}
```

---

## Frontend

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Routes

The frontend application includes the following routes:

| Route               | Description                                |
|---------------------|--------------------------------------------|
| `/`                 | Home page showcasing available services   |
| `/login`            | User login page                           |
| `/register`         | User registration page                    |
| `/cart`             | User cart page                            |
| `/checkout`         | Checkout and purchase confirmation        |

### Reason for Excluding Seller Portion

The seller portion is not included in the frontend as the primary focus of this application is on providing users with a seamless experience for browsing and purchasing services. Additionally, seller functionalities such as service management are better suited for a dedicated admin or seller portal, which can be developed separately for enhanced scalability and role-specific features.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
