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
