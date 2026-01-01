# Freight Marketplace (MVP)

Two-sided marketplace connecting shippers (customers) and carriers (drivers) with an admin panel.

## Tech
- Frontend: React + Vite + TypeScript + Tailwind (apps/frontend)
- Backend: Node + Express + TypeScript + SQLite (apps/backend)
- Auth: Email/password + JWT, role-based routes

## Setup

Prereqs: Node 18+, pnpm or npm, SQLite bundled, or Docker (optional).

### Backend

1. Copy env
```
cp apps/backend/.env.example apps/backend/.env
```
2. Install deps
```
cd apps/backend
npm install
```
3. Migrate & seed
```
npm run migrate
npm run seed
```
4. Run dev server
```
npm run dev
```
API at http://localhost:4000

### Frontend

1. Configure API URL
```
cp apps/frontend/.env.example apps/frontend/.env
```
2. Install & run
```
cd apps/frontend
npm install
npm run dev
```
Web app at http://localhost:5173

### Demo Accounts
- Admin: admin@example.com / password123
- Customer: alice@example.com / password123
- Driver: driver.delta@example.com / password123

## Features Implemented
- Users, driver profiles, shipments, quotes, bookings, messages, invoices
- Admin: users table, block users (with audit), marketplace stats, cancel endpoints
- Billing: unpaid/past due simulation, blocking enforcement middleware

## Netlify (frontend)
A netlify.toml can be added in apps/frontend for build (vite) and SPA redirects. Example:
```
[build]
  command = "npm run build"
  publish = "dist"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Stripe Later
Payments are simulated; code structured to add a provider module later.

## Notes
- Database path: apps/backend/data/app.db (create folder if needed)
- To reset DB: delete the file and re-run migrations and seed
