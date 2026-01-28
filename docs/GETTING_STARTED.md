# E-Commerce Platform

A complete full-stack e-commerce solution with React frontend and Node.js backend.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Setup Environment Variables

**Backend (.env)**

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
```

### 3. Run Development Servers

```bash
npm run dev
```

Or run separately:
