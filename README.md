# StyleHub - Full-Stack E-Commerce Platform

> A comprehensive **MERN stack** e-commerce application built for modern fashion retail. Features complete product catalog, secure authentication, shopping cart, order management, payment processing, and admin dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👥 Customer Features

- ✅ **User Authentication** - Secure JWT-based login/signup with refresh tokens
- ✅ **Product Catalog** - Browse 100+ products with filtering by category, price, rating
- ✅ **Advanced Search** - Full-text search across products and collections
- ✅ **Shopping Cart** - Add/remove items with quantity management and persistent storage
- ✅ **Checkout** - Multi-step checkout with address and payment information
- ✅ **Secure Payments** - Stripe payment integration (test mode)
- ✅ **Order Tracking** - Real-time order status updates and history
- ✅ **Wishlist** - Save favorite products for later
- ✅ **Product Reviews** - Read and write reviews with ratings
- ✅ **User Profile** - Manage account details and password
- ✅ **Responsive Design** - Mobile-first design for all devices

### 🔧 Admin Features

- ✅ **Dashboard Analytics** - Overview of sales, orders, and revenue
- ✅ **Product Management** - Full CRUD for products with image upload
- ✅ **Order Management** - View and update order statuses
- ✅ **User Management** - View all users and manage roles
- ✅ **Discount Management** - Create and manage promotional codes
- ✅ **Payment Tracking** - Monitor transactions and payment history
- ✅ **Audit Logs** - Track all admin activities

### 🛠️ Technical Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Protected Routes** - Role-based access control (Admin/Customer)
- ✅ **State Management** - React Context API for Auth, Cart, Wishlist
- ✅ **Responsive UI** - Tailwind CSS with mobile-first approach
- ✅ **Error Handling** - Comprehensive validation and error boundaries
- ✅ **SEO Optimization** - Dynamic titles, meta descriptions, semantic HTML
- ✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **API Documentation** - Complete REST API reference with examples

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version  | Purpose                 |
| ---------------- | -------- | ----------------------- |
| **React**        | 18.2     | UI framework with hooks |
| **React Router** | 6.x      | Client-side routing     |
| **Tailwind CSS** | 3.x      | Utility-first styling   |
| **Context API**  | Built-in | State management        |
| **Axios**        | 1.x      | HTTP client             |
| **React Icons**  | Latest   | SVG icon library        |

### Backend

| Technology     | Version | Purpose             |
| -------------- | ------- | ------------------- |
| **Node.js**    | 14+     | Runtime environment |
| **Express.js** | 4.x     | Web framework       |
| **MongoDB**    | Latest  | NoSQL database      |
| **Mongoose**   | 7.x     | MongoDB ODM         |
| **JWT**        | Latest  | Authentication      |
| **Bcryptjs**   | Latest  | Password hashing    |
| **Stripe**     | Latest  | Payment processing  |

### Admin Dashboard

| Technology       | Version | Purpose            |
| ---------------- | ------- | ------------------ |
| **React**        | 18.2    | UI framework       |
| **Recharts**     | Latest  | Data visualization |
| **Tailwind CSS** | 3.x     | Styling            |

---

## 📁 Project Structure

```
ecommerce-platform/
├── frontend/                          # React customer application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation header
│   │   │   ├── Footer.js            # Footer component
│   │   │   ├── Hero.js              # Hero section
│   │   │   ├── ProductCard.js       # Product card
│   │   │   ├── CartSidebar.js       # Shopping cart sidebar
│   │   │   └── ... (20+ components)
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Auth state
│   │   │   ├── CartContext.js       # Cart state
│   │   │   ├── WishlistContext.js   # Wishlist state
│   │   │   └── ToastContext.js      # Notifications
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── OrdersPage.js
│   │   ├── services/
│   │   │   └── api.js              # Axios client
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                           # Node.js API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Review.js
│   │   │   └── Discount.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── validation.js       # Input validation
│   │   │   ├── errorHandler.js
│   │   │   └── auditLog.js
│   │   ├── utils/
│   │   │   ├── email.js
│   │   │   ├── logger.js
│   │   │   └── response.js
│   │   └── index.js
│   └── package.json
│
├── admin/                             # React admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── UsersPage.js
│   │   │   └── AnalyticsPage.js
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── API_REFERENCE.md                 # REST API documentation
├── GETTING_STARTED.md               # Setup guide
├── CONTRIBUTING.md                  # Contribution guidelines
├── GITHUB_READY.md                  # GitHub submission checklist
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Stripe Account** (for payment testing)

### Installation

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform
```

#### Step 2: Install Dependencies

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Admin Dashboard
cd admin && npm install && cd ..
```

#### Step 3: Configure Environment Variables

**Backend** (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Image Hosting
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`)

```env
REACT_APP_API_URL=http://localhost:5000
```

**Admin** (`admin/.env.local`)

```env
REACT_APP_API_URL=http://localhost:5000
```

#### Step 4: Start Development Servers

**Option A: Run all at once**

```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 - Backend:

```bash
cd backend
npm start
```

Terminal 2 - Frontend:

```bash
cd frontend
npm start
```

Terminal 3 - Admin:

```bash
cd admin
npm start
```

#### Step 5: Access Applications

| Application           | URL                   | Credentials       |
| --------------------- | --------------------- | ----------------- |
| **Customer Frontend** | http://localhost:3000 | Create account    |
| **Admin Dashboard**   | http://localhost:3001 | Use admin account |
| **API Server**        | http://localhost:5000 | See API docs      |

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/signup           Register new user
POST   /api/auth/login            User login
POST   /api/auth/refresh-token    Refresh access token
GET    /api/auth/me               Get current user
```

### Products

```
GET    /api/products              Get all products
GET    /api/products/:id          Get single product
POST   /api/products              Create product (Admin)
PUT    /api/products/:id          Update product (Admin)
DELETE /api/products/:id          Delete product (Admin)
```

### Shopping Cart

```
GET    /api/cart                  Get cart (Protected)
POST   /api/cart                  Add to cart (Protected)
PUT    /api/cart/:itemId          Update quantity (Protected)
DELETE /api/cart/:itemId          Remove item (Protected)
```

### Orders

```
POST   /api/orders                Create order (Protected)
GET    /api/orders                Get user orders (Protected)
GET    /api/orders/:id            Get order details (Protected)
```

### Payments

```
POST   /api/payments              Create payment (Protected)
GET    /api/payments/:id          Get payment details (Protected)
```

### Reviews

```
GET    /api/reviews/:productId    Get product reviews
POST   /api/reviews               Create review (Protected)
PUT    /api/reviews/:id           Update review (Protected)
DELETE /api/reviews/:id           Delete review (Protected)
```

### Admin

```
GET    /api/admin/dashboard       Dashboard stats (Admin)
GET    /api/admin/users           List users (Admin)
GET    /api/admin/orders          List orders (Admin)
GET    /api/admin/products        List products (Admin)
```

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed endpoint documentation.

---

## ⚙️ Configuration

### Environment Variables

All configuration is done through `.env` files. See `.env.example` files in each directory.

**Critical Variables:**

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API key (test mode)

### Database Setup

**Option 1: Local MongoDB**

```bash
# Start MongoDB service
mongod

# Connection string
mongodb://localhost:27017/ecommerce
```

**Option 2: MongoDB Atlas**

1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add as `MONGO_URI` in `.env`

### Stripe Setup

1. Create account at https://stripe.com
2. Get test mode secret key
3. Add as `STRIPE_SECRET_KEY` in `.env`
4. Use test card: `4242 4242 4242 4242`

---

## 🧪 Testing

### Test Accounts

**Customer Account**

- Email: `customer@example.com`
- Password: `password123`

**Admin Account**

- Email: `admin@example.com`
- Password: `admin123`

### Test Payment

Use Stripe test card:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (MM/YY)
- **CVC**: Any 3 digits

---

## 📦 Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Backend Deployment

**Deploy to Railway:**

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy

**Deploy to Render:**

1. Connect GitHub repository
2. Add build command: `npm install`
3. Add start command: `npm start`
4. Set environment variables
5. Deploy

---

## 📋 Project Checklist

- ✅ Full MERN stack implementation
- ✅ User authentication with JWT
- ✅ Product catalog with filtering
- ✅ Shopping cart functionality
- ✅ Secure checkout flow
- ✅ Payment processing (Stripe)
- ✅ Order management system
- ✅ Admin dashboard with analytics
- ✅ User profile management
- ✅ Product reviews and ratings
- ✅ Responsive mobile design
- ✅ SEO optimization
- ✅ Error handling & validation
- ✅ API documentation
- ✅ Protected routes & RBAC

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth with refresh tokens
- ✅ **Password Hashing** - Bcryptjs with salt rounds
- ✅ **Input Validation** - Server-side validation on all inputs
- ✅ **CORS** - Configured for development and production
- ✅ **Protected Routes** - Role-based access control
- ✅ **Secure Headers** - Helmet.js for security headers
- ✅ **Error Messages** - No sensitive info in errors
- ✅ **Rate Limiting** - Prevents brute force attacks

---

## 📚 Documentation

- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Detailed setup guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [GITHUB_READY.md](./GITHUB_READY.md) - GitHub submission checklist

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## ⚠️ Disclaimer

**Demo Project for Educational Purposes**

- Stripe runs in test mode - no real payments processed
- Uses demo products and sample data
- Not production-hardened
- For learning and portfolio purposes only

For production use, additional security audits and professional review are required.

---

## 🙋 Support

For questions or issues:

- Open an [Issue](../../issues)
- Check [API_REFERENCE.md](./API_REFERENCE.md)
- Review [GETTING_STARTED.md](./GETTING_STARTED.md)

---

<div align="center">

**Built with ❤️ using React, Node.js, and MongoDB**

[⭐ Star this repo](../../) if you found it helpful!

</div>
