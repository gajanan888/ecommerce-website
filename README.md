# 🛍️ EliteWear - Premium Fashion Store

[![GitHub stars](https://img.shields.io/github/stars/gajanan888/ecommerce-website?style=social)](https://github.com/gajanan888/ecommerce-website)
[![GitHub forks](https://img.shields.io/github/forks/gajanan888/ecommerce-website?style=social)](https://github.com/gajanan888/ecommerce-website)
[![GitHub issues](https://img.shields.io/github/issues/gajanan888/ecommerce-website)](https://github.com/gajanan888/ecommerce-website/issues)
[![GitHub license](https://img.shields.io/github/license/gajanan888/ecommerce-website)](https://github.com/gajanan888/ecommerce-website/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/gajanan888/ecommerce-website/pulls)

A fully functional, feature-rich E-Commerce application built with the **MERN Stack** (MongoDB, Express, React, Node.js). This project demonstrates a production-ready architecture with role-based authentication, real-time updates, and a modern UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Key Features

### 👤 User Features (Customer)

- **Responsive UI**: Mobile-friendly shopping interfaces built with reusable React components that adapt across phone, tablet, and desktop screens.
- **Authentication**: Secure Login & Registration with JWT.
- **Product Browsing**: Filter by category, price, search capabilities.
- **Shopping Cart**: Real-time cart management.
- **Wishlist**: Save favorite items for later.
- **Checkout Process**: Secure checkout flow with address selection.
- **Order History**: Track past orders and view status updates.
- **Profile Management**: Update personal details and password.

### 🛡️ Admin Features (Store Manager)

- **Dashboard**: Real-time overview of Revenue, Orders, and Users.
- **Product Management**: Create, Read, Update, and Delete (CRUD) products.
- **Order Management**: Process orders, update status (Pending -> Shipped -> Delivered).
- **Inventory Control**: Track stock levels and receive low-stock alerts.
- **User Management**: View and manage customer accounts.

---

## 🛠️ Tech Stack

### Frontend

- **React.js**: UI Library
- **Tailwind CSS**: Styling & Design System
- **Reusable Components**: Shared navigation, product, filter, cart, and layout components for a consistent responsive experience.
- **Context API + Redux**: State Management
- **React Router**: Navigation
- **Axios**: API Integration

### Backend

- **Node.js & Express**: Server Runtime & Framework
- **MongoDB & Mongoose**: Database & ODM
- **JWT (JSON Web Tokens)**: Authentication
- **Multer**: File Uploads

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Git**

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ecommerce-platform
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

### 4. Database Seeding & Admin Setup

Populate the database with initial data and create an admin user:

**Seed Data (Optional):**

```bash
# In backend directory
npm run seed
```

**Create Admin User:**

1. Open `backend/scripts/makeAdmin.js`.
2. Edit the `email` variable to match your registered user email.
3. Run the script:

```bash
cd backend/scripts
node makeAdmin.js
```

### 5. Formatting

Keep the codebase clean and consistent:

```bash
npm run format
```

---

## 📖 Documentation & Guides

Detailed guides can be found in the [docs](./docs) directory:

- [Getting Started](./docs/GETTING_STARTED.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [System Health Report](./docs/SYSTEM_HEALTH_REPORT.md)

---

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers simultaneously.

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm start
```

The application will launch at **http://localhost:3000**.

---

## 📖 Pages & Functionality Guide

### Public Pages

| Page                                | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| **Home (`/`)**                      | Landing page with featured products and hero section.           |
| **Products (`/products`)**          | Full catalog with sidebar filters (Category, Price) and search. |
| **Product Detail (`/product/:id`)** | Detailed view with images, description, and "Add to Cart".      |
| **Login / Register**                | Authentication pages for user access.                           |

### Customer Protected Pages

| Page                       | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| **Cart (`/cart`)**         | Review selected items, adjust quantities, and proceed to checkout. |
| **Checkout**               | Secure multi-step form for shipping address and payment.           |
| **Profile (`/profile`)**   | Manage user information and view account details.                  |
| **Orders (`/orders`)**     | List of all past orders with status tracking.                      |
| **Wishlist (`/wishlist`)** | Collection of saved items.                                         |

### Admin Pages (Requires Admin Role)

| Page                                    | Description                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Dashboard (`/admin/dashboard`)**      | Analytics hub showing Total Revenue, Order Counts, and Recent Activity.                      |
| **Manage Products (`/admin/products`)** | Table view to Edit/Delete existing products or Add new ones.                                 |
| **Manage Orders (`/admin/orders`)**     | View all customer orders, change statuses (e.g., mark as Shipped), and update tracking info. |

---

## 📂 Project Structure

```
ecommerce-platform/
├── backend/                # Node.js API Server
│   ├── src/
│   │   ├── controllers/    # Request logic
│   │   ├── models/         # DB Schemas
│   │   ├── routes/         # API Endpoints
│   │   ├── middleware/     # Auth & Error handling
│   │   └── index.js        # Entry point
│   └── scripts/            # Admin & Seed scripts
│
└── frontend/               # React Application
    ├── public/
    └── src/
        ├── components/     # Reusable UI components
        ├── context/        # Global state (Auth, Cart)
        ├── pages/          # Full page views
        └── services/       # API call functions
```
