# 🛒 E-Commerce REST API

A full-featured e-commerce backend built with **Node.js**, **Express**, and **PostgreSQL**.  
This API enables user authentication, product management, shopping cart functionality, and order processing.

---

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Docs**: Swagger (OpenAPI)
- **Other Tools**: pg, dotenv

---

## ⚙️ Features

✅ User registration & login  
✅ JWT authentication middleware  
✅ Role-based access (user/admin)  
✅ Products CRUD  
✅ User carts (add, remove, clear)  
✅ Checkout + Orders system  
✅ Swagger API documentation

---

## 📁 Project Structure

```
e-commerce-api/
├── config/              # Database configuration
├── controllers/         # Business logic
├── middleware/          # Auth & error middleware
├── routes/              # API route definitions
├── swagger/             # Swagger setup
├── .env                 # Environment variables
├── README.md            # This file
└── server.js            # Entry point
```

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/e-commerce-api.git
cd e-commerce-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup PostgreSQL

Create a database manually (e.g. `ecommerce_db`) using `pgAdmin` or CLI.  
Update `.env` with your credentials:

```
PORT=5000
DATABASE_URL=postgres://your_user:your_pass@localhost:5432/ecommerce_db
JWT_SECRET=your_super_secret
```

### 4. Import the schema

Use `psql` or `pgAdmin` to run the included SQL file:

```bash
psql -U your_user -d ecommerce_db -f ecommerce_schema_complete.sql
```

### 5. Start the server

```bash
npm start
```

---

## 📚 API Documentation

Swagger UI available at:

📎 [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## 🔐 Auth Routes

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/register` | Register new user   |
| POST   | `/auth/login`    | Login & get token   |

---

## 🛍️ Products

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/products`           | Get all products         |
| GET    | `/products/:id`       | Get product by ID        |
| POST   | `/products`           | Create new product       |
| PUT    | `/products/:id`       | Update product           |
| DELETE | `/products/:id`       | Delete product           |

---

## 🛒 Cart

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | `/cart`                      | Get/create cart for user       |
| POST   | `/cart/:cartId`              | Add item to cart               |
| GET    | `/cart/:cartId`              | View items in cart             |
| DELETE | `/cart/:cartId`              | Clear entire cart              |
| DELETE | `/cart/:cartId/:itemId`      | Remove item from cart          |
| POST   | `/cart/:cartId/checkout`     | Checkout (create order)        |

---

## 📦 Orders

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | `/orders`                    | Place order from cart          |
| GET    | `/orders`                    | Get all user orders            |
| GET    | `/orders/:orderId`           | Get specific order             |
| PATCH  | `/orders/:id/status`         | Update order status (admin)    |

---

## 👤 Users

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/users`           | Get all users (admin)    |
| GET    | `/users/:id`       | Get specific user        |
| PUT    | `/users/:id`       | Update user details      |
| DELETE | `/users/:id`       | Delete user account      |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE)

---

## ✨ Author

**Przemysław Pietkun**  
🔗 [GitHub](https://github.com/Silentmaster86) | 🌐 [Portfolio](https://simon-mikes.com)
