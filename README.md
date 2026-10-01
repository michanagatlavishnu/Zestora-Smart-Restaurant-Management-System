# ZESTORA - Smart Restaurant Order & Billing Management System

A premium, fully-functional, real-time restaurant management platform built with React, Node.js, Express, MySQL, and Socket.IO.

## Features

- **Role-Based Access Control**: Secure login and protected routes for ADMIN, MANAGER, CASHIER, WAITER, and KITCHEN.
- **Real-Time KDS & Operations**: Waiters place orders via POS, Kitchen instantly receives it, and status updates cascade across all screens without refreshing.
- **Smart Billing & Receipts**: Taxes, GST, Service Charges are automatically computed. Cashiers can process payments and print professional receipts.
- **Table Management**: Table availability transitions automatically between AVAILABLE and OCCUPIED based on real-time orders and payments.
- **Dashboard & Analytics**: Rich, interactive charts detailing revenue, orders, and category performance.
- **Global Search**: Instantly find customers, orders, menu items, or staff from anywhere in the app.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, Socket.IO, Helmet, bcrypt, jsonwebtoken.
- **Database**: MySQL.

## Getting Started

### Database
1. Run `database/schema.sql` to create the structure.
2. Run `database/seed.sql` to populate demo data.

### Backend
1. Navigate to `/backend`
2. Configure `.env` with your DB credentials and `PORT=5001`.
3. `npm install`
4. `npm start` (Runs on port 5001)

### Frontend
1. Navigate to `/frontend`
2. `npm install`
3. `npm run dev` (Runs on port 5174)

## Demo Credentials

You can log in to the application using the following demo accounts (Password for all accounts is **password123**):

- **Admin:** `admin@zestora.com`
- **Manager:** `manager@zestora.com`
- **Cashier:** `cashier@zestora.com`
- **Waiter:** `waiter@zestora.com`
- **Kitchen:** `kitchen@zestora.com`

*Designed with a premium futuristic restaurant aesthetic.*
