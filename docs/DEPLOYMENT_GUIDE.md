# 🚀 Deployment Guide for EliteWear (MERN Stack)

This guide explains how to deploy your E-Commerce application to the web so anyone can access it.

We will use **free/popular services**:

- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/) or [Railway](https://railway.app/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Database)

---

## 1. ☁️ Step 1: Set up Cloud Database (MongoDB Atlas)

Since your local database (`mongodb://localhost...`) won't work on the cloud, you need a cloud database.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2.  Create a **FREE Cluster**.
3.  In **Database Access**, create a user (e.g., `admin`) and password.
4.  In **Network Access**, allow access from **Anywhere (0.0.0.0/0)**.
5.  Click **Connect** -> **Drivers** and copy the **Connection String**.
    - It looks like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority`
    - **Save this URL**, you will need it for the Backend.

---

## 2. ⚙️ Step 2: Deploy Backend (Render)

1.  Push your code to **GitHub**.
2.  Sign up on [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    - **Root Directory**: `backend` (Important! Your server is in this subfolder)
    - **Build Command**: `npm install`
    - **Start Command**: `node src/index.js`
6.  **Environment Variables** (Add these):
    - `MONGODB_URI`: _Paste your MongoDB Atlas URL from Step 1_
    - `JWT_SECRET`: _SomeRandomSecretKey123_
    - `PORT`: `10000` (Render default)
