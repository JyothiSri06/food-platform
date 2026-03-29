# SD Foods E-Commerce Platform

A production-ready full-stack PERN application for food delivery with dual delivery methods (Local & Courier), Paytm integration, and Cloudinary for asset management.

## Project Structure
- `client/`: React 18 frontend powered by Vite and Tailwind CSS.
- `server/`: Express.js backend with PostgreSQL database interactions and JWT auth.

## Prerequisites
- Node.js (v18+)
- PostgreSQL server running (default expects postgres:postgres on localhost:5432)

## Setup Instructions

### 1. Database Initialization
From the `server` directory, ensure your `.env` has valid PostgreSQL credentials.
Then run the DB init and seeding scripts:
```bash
cd server
node initDb.js
npm install bcryptjs # in case you haven't
node seedProducts.js
```

### 2. Start the Backend
From the `server` directory:
```bash
npm run dev
```

### 3. Start the Frontend
In a new terminal from the `client` directory:
```bash
npm run dev
```

### 4. Testing the App
1. Go to `http://localhost:5173/` in your browser.
2. Login with `admin@sdfoods.com` / `admin123` to access the Admin Dashboard.
3. Login with `delivery@sdfoods.com` / `admin123` to access the Delivery Partner Portal.
4. Create a customer account or place fake orders. Fresh products will be assigned local delivery; Packaged products will use courier.

## Deployment Notes
- **Frontend (Vercel)**: Point Vercel to the `client/` directory and ensure `VITE_API_URL` is set to your production API.
- **Backend (Render/Railway)**: Point it to the `server/` root. Ensure all ENV variables from `.env` are transferred correctly. Provide external PostgreSQL connection string.
