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
    - **Start Command**: `npm start`
6.  **Environment Variables** (Add these):
    - `MONGODB_URI`: _Paste your MongoDB Atlas URL from Step 1_
    - `PORT`: `10000` (Render default)
    - `NODE_ENV`: `production`
    - `FRONTEND_URL`: _Your exact Vercel URL, including `https://`_
    - `JWT_SECRET`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`: _strong unique secrets_
    - `ACCESS_TOKEN_EXPIRY`: `1d`
    - `REFRESH_TOKEN_EXPIRY`: `7d`
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: _test or live Razorpay credentials_
    - `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET`: _Cloudinary credentials_
    - `EMAIL_SERVICE`: `gmail`
    - `EMAIL_USER`: _Gmail address_
    - `EMAIL_PASSWORD`: _Gmail App Password, without spaces_
7.  Click **Deploy**.
    - Once done, Render will give you a URL like: `https://elitewear-backend.onrender.com`.
    - **Copy this URL**.

---

## 3. 🎨 Step 3: Deploy Frontend (Vercel)

1.  Sign up on [Vercel](https://vercel.com/).
2.  Click **Add New Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Framework Preset**: Create React App
    - **Root Directory**: Click `Edit` and select `frontend`.
5.  **Environment Variables**:
    - **Name**: `REACT_APP_API_URL`
    - **Value**: `https://elitewear-backend.onrender.com/api` (Your Backend URL from Step 2 plus `/api`)
6.  Click **Deploy**.
    - Vercel will give you your live website URL (e.g., `https://elitewear.vercel.app`).

---

## 4. 👑 Step 4: Making Yourself Admin in Production

Since this is a _new_ database, your user accounts don't exist yet.

1.  **Register** a new account on your live website (`https://elitewear.vercel.app/register`).
2.  Now you need to promote this user to Admin. You have two options:

    **Option A: Run Script Locally (Easiest)**
    1.  On your local machine, open `backend/.env`.
    2.  Temporarily change `MONGODB_URI` to your **Cloud Atlas URL** (from Step 1).
    3.  Run the admin script:
        ```bash
        cd backend/scripts
        node makeAdmin.js
        ```
    4.  Change your local `.env` back to `mongodb://localhost...` when done.

    **Option B: Manually in MongoDB Atlas**
    1.  Go to MongoDB Atlas -> **Browse Collections**.
    2.  Find the `users` collection.
    3.  Find your user document.
    4.  Click the **Pencil icon** (Edit).
    5.  Change `"role": "customer"` to `"role": "admin"`.
    6.  Click **Update**.

---

## 5. ✅ Step 5: Accessing Admin Panel

1.  Go to your deployed website: `https://elitewear.vercel.app`
2.  **Login** with your account.
3.  Navigate to: `https://elitewear.vercel.app/admin/dashboard`

You are now live! 🚀
