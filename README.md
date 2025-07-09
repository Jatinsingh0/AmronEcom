# AmronShop - E-commerce Platform

A modern e-commerce app built with Next.js 15, featuring user authentication, shopping cart, and responsive design.

## 🚀 Features

- **User Authentication**: Login/signup with JWT tokens
- **Shopping Cart**: Persistent cart with guest and user storage
- **Product Catalog**: Featured products with detailed modals
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Order Management**: Purchase history tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT, bcryptjs
- **UI**: Radix UI components, 

## 📦 Quick Start

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd ecom
   npm install
   ```

2. **Set up environment**
   Create `.env.local`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

## 📁 Project Structure

```
ecom/
├── src/app/
│   ├── api/              # API routes (login, signup, logout)
│   ├── components/       # Page components
│   ├── cart/            # Shopping cart page
│   ├── login/           # Auth pages
│   └── orders/          # Order history
├── src/components/ui/   # Reusable UI components
└── src/lib/            # Utilities
```


---

**AmronShop** - Simple and secure online shopping! 🛒
