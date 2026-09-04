# 1Fi EMI Product Platform

## Overview

This is a simplified full-stack implementation of the 1Fi SDE1 Full Stack Developer assignment.

The application displays products with multiple variants and mutual fund-backed EMI plans. Product data is stored in PostgreSQL and served through an Express API. The React frontend loads everything dynamically — nothing is hardcoded in the UI.

## Features

- Database-backed product catalog
- Product variants with images
- Dynamic product pages by slug
- EMI plans (monthly amount, tenure, interest, optional cashback)
- EMI plan selection
- Proceed interaction with inline confirmation
- Responsive fintech-style UI
- API-driven data (no hardcoded products or EMI values in React)

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express

### Database

- PostgreSQL (Neon)
- Prisma ORM

## Architecture

```
React (Vite)
    ↓ HTTP
Express API
    ↓ Prisma Client
PostgreSQL
```

- `client/` — React SPA
- `server/` — Express REST API + Prisma

## Project Structure

```
1fi-emi/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Gallery, variants, EMI cards
│   │   ├── pages/          # Home + Product pages
│   │   ├── config.js       # VITE_API_URL base URL
│   │   └── utils/          # Currency formatting
│   ├── .env.example
│   └── package.json
└── server/                 # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.js
    │   └── migrations/
    ├── src/
    │   ├── index.js
    │   ├── prisma.js
    │   └── routes/
    ├── .env.example
    └── package.json
```

## Database Schema

### Product

- `id` (cuid, primary key)
- `name`
- `slug` (unique)
- `brand`
- `description`
- `mrp` (Decimal)
- `price` (Decimal)
- `createdAt`

### Variant

- `id`
- `productId` (FK → Product, cascade delete)
- `name` (e.g. Color)
- `value` (e.g. Silver)
- `image` (URL)

### EmiPlan

- `id`
- `productId` (FK → Product, cascade delete)
- `tenure` (months)
- `monthlyAmount` (Decimal)
- `interestRate` (Decimal)
- `cashback` (optional Decimal)

### Relationships

- One **Product** has many **Variants**
- One **Product** has many **EmiPlans**
- Variant and EmiPlan each belong to one Product

## API Endpoints

Base URL (local): `http://localhost:5000`

### GET `/api/health`

**Purpose:** Confirm the Express server is running.

**Request:** none

**Success response (200):**

```json
{
  "success": true,
  "message": "API is running"
}
```

### GET `/api/products`

**Purpose:** Return a lightweight list of all products (no variants or EMI plans).

**Request:** none

**Success response (200):**

```json
{
  "success": true,
  "products": [
    {
      "id": "...",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "description": "...",
      "mrp": "149900",
      "price": "134900",
      "createdAt": "2026-09-04T11:00:33.337Z"
    }
  ]
}
```

**Error response (500):**

```json
{
  "success": false,
  "message": "Failed to fetch products"
}
```

Money fields are returned as strings (Prisma Decimal → string) to preserve precision.

### GET `/api/products/:slug`

**Purpose:** Return one product by unique slug, including variants and EMI plans.

**Example:** `GET /api/products/iphone-17-pro`

**Success response (200):**

```json
{
  "success": true,
  "product": {
    "id": "...",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "description": "...",
    "mrp": "149900",
    "price": "134900",
    "createdAt": "...",
    "variants": [
      {
        "id": "...",
        "name": "Color",
        "value": "Silver",
        "image": "https://..."
      }
    ],
    "emiPlans": [
      {
        "id": "...",
        "tenure": 3,
        "monthlyAmount": "44967",
        "interestRate": "0",
        "cashback": "2000"
      }
    ]
  }
}
```

**Not found (404):**

```json
{
  "success": false,
  "message": "Product not found"
}
```

**Server error (500):**

```json
{
  "success": false,
  "message": "Failed to fetch product"
}
```

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Product listing (from `GET /api/products`) |
| `/products/:slug` | Dynamic product detail page |
| `/products/iphone-17-pro` | Example product |
| `/products/samsung-s25-ultra` | Example product |
| `/products/macbook-air` | Example product |

The detail page reads `:slug` from React Router and fetches `GET /api/products/:slug`. Invalid slugs show a friendly not-found state.

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd 1fi-emi

cd server
npm install

cd ../client
npm install
```

### 2. Environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in real values:

```bash
cd server
cp .env.example .env
```

**Client** — copy `client/.env.example` to `client/.env`:

```bash
cd client
cp .env.example .env
```

### 3. Database

```bash
cd server
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start the backend

```bash
cd server
npm run dev
```

Or for production-style start:

```bash
cd server
npm start
```

Server listens on `PORT` (default `5000`).

### 5. Start the frontend

```bash
cd client
npm run dev
```

Open the Vite URL (typically `http://localhost:5173`).

### 6. Production frontend build (optional)

```bash
cd client
npm run build
npm run preview
```

## Environment Variables

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) |

Do not put secrets in `VITE_` variables — they are exposed to the browser.

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Express port (default `5000`) |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:5173`) |

Use placeholders in `.env.example` only. Never commit real credentials.

## Database Seed

The seed script creates:

- **3 products** (iPhone 17 Pro, Samsung Galaxy S25 Ultra, MacBook Air)
- **3 variants** per product
- **5 EMI plans** per product (3, 6, 12, 24, 36 months)

Re-run safely during development:

```bash
cd server
npm run db:seed
```

Seeding is **not** run automatically when the server starts.

## Assignment Coverage

| Requirement | Status |
|-------------|--------|
| Product name, variant, MRP, selling price, image | Done |
| EMI monthly amount, tenure, interest, cashback | Done |
| Selectable EMI plans | Done |
| Proceed with selected plan | Done |
| Data from backend API + database (not hardcoded in React) | Done |
| Unique product URLs (`/products/:slug`) | Done |
| At least 3 products | Done |
| At least 2 variants per product | Done (3 each) |
| Database schema + seed data | Done |
| Product + EMI APIs | Done |
| Responsive UI | Done |
| README | Done |
| Deployed application | Pending (Phase 5.2) |
| Demo video | Pending |

## Deployment

Frontend URL:  
**TBD**

Backend URL:  
**TBD**

Typical production setup:

1. Deploy `server/` with `DATABASE_URL`, `PORT`, and `FRONTEND_URL` set to the live frontend origin.
2. Run Prisma migrations against the production database (`npx prisma migrate deploy`).
3. Seed once if needed (`npm run db:seed`).
4. Deploy `client/` with `VITE_API_URL` set to the live backend URL at **build** time.
5. Do not commit `.env` files.

## Demo Video

Demo Video:  
**TBD**

## License

ISC
