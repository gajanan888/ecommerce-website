# 🛡️ Admin Panel Documentation & Architecture

This document provides a technical overview of the Admin Panel implementation for the **EliteWear** E-Commerce Platform. It allows store administrators to manage products, orders, users, and view business analytics.

---

## 🏗️ Architecture Overview

The Admin Panel conforms to the system's **Model-View-Controller (MVC)** architecture and uses **Role-Based Access Control (RBAC)** to ensure security.

### 1. Authentication & Security

- **JWT Middleware (`protect`)**: Verifies the admin's session token.
- **Role Middleware (`adminAuth`)**: Strictly checks `user.role === 'admin'`. This "Guard at the Gate" approach prevents unauthorized access even if a valid user token is present.
- **Frontend Protection**: The `<ProtectedRoute requireAdmin={true} />` wrapper redirects non-admins to the home page immediately.

---

## 🛠️ Features & capabilities

### 📊 1. Dashboard (`/admin/dashboard`)

**Purpose**: Central hub for business intelligence.

- **Backend**: `GET /api/admin/dashboard/stats`
- **Logic**: Uses MongoDB aggregation pipelines to calculate:
  - Total Revenue (Sum of all completed payments)
  - Order Volume (Pending vs. Shipped vs. Delivered)
  - User Growth (Total registered accounts)

### 📦 2. Product Management (`/admin/products`)

**Purpose**: Full inventory control (CRUD).

- **Create**: Upload images (processed via Multer) and set attributes like Price, Stock, Category.
- **Read**: Filterable table view with server-side pagination.
- **Update**: Edit details, restock inventory, or change prices.
- **Delete**: Soft or hard delete items from the catalog.

### 🚚 3. Order Management (`/admin/orders`)

**Purpose**: Logistics and fulfillment tracking.

- **View**: Inspect customer details, shipping addresses, and order items.
- **Process**:
  - Update Status: `Pending` ➝ `Confirmed` ➝ `Shipped` ➝ `Delivered`
  - Add Tracking: Associate a tracking number with an order.
  - Payment Status: Manually mark payments as `Completed` or `Refunded`.

---

## 🚀 API Route Structure

All admin routes are prefixed with `/api/admin` and protected by dual middleware.

| Method     | Endpoint               | Description                         |
| :--------- | :--------------------- | :---------------------------------- |
| **GET**    | `/dashboard/stats`     | Get aggregate business stats        |
| **GET**    | `/products`            | List all products (with pagination) |
| **POST**   | `/products`            | Create a new product                |
| **PUT**    | `/products/:id`        | Update product details              |
| **DELETE** | `/products/:id`        | Delete a product                    |
| **GET**    | `/orders`              | View all customer orders            |
| **PUT**    | `/orders/:id/status`   | Update order workflow status        |
| **PUT**    | `/orders/:id/tracking` | Add shipping tracking number        |

---

## 💻 Tech Stack Highlights

- **Frontend**: React.js, Tailwind CSS, Recharts (Visuals), React Hook Form.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Security**: JSON Web Tokens (JWT), BCrypt (hashing), Helmet (headers).

---

## 👨‍💻 Developer Set Up (How to Run)

1.  **Create an Admin User**:
    Run the included script to promote your user account:

    ```bash
    cd backend/scripts
    node makeAdmin.js
    ```

2.  **Access the Panel**:
    Log in with your admin credentials and navigate to:
    `http://localhost:3000/admin/dashboard`

---

## 📝 Resume Summary (Copy-Paste Ready)

> "Designed and implemented a secure, full-stack Admin Panel for an E-Commerce platform. Features include a real-time dashboard with analytics, role-based access control (RBAC) middleware for security, and comprehensive CRUD interfaces for inventory and order management. Built using React, Node.js, and MongoDB aggregation pipelines."
