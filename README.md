<div align="center">

# 📦 LogiTrack — Enterprise Logistics & Shipment Management

**A full-stack, multi-role logistics tracking and supply-chain management platform built with React 19, Three.js, Node.js, Express, and MongoDB.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20In--Memory-brightgreen.svg)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85ea2d.svg)](https://swagger.io/)
[![Tests](https://img.shields.io/badge/Tests-42%20Passing-success.svg)](./backend/scripts/test.js)

</div>

---

## 📖 Overview

**LogiTrack** is an end-to-end supply-chain tracking and warehouse operations platform. It models real-world freight movements from initial client booking through warehouse intake, sorting, regional distributor handover, driver dispatch, and final delivery confirmation.

**Key highlights:**
- **Strict Transition Engine** — a server-side state-machine matrix enforcing valid status progressions across **Standard Flow** and **Express Flow** routes
- **Role-Based Access Control (RBAC)** — granular permissions for **Clients**, **Warehouse Workers**, **Distributor Hub Managers**, **Couriers / Delivery Agents**, and **System Administrators**
- **Interactive Geospatial Tracking** — real-time shipment progress, delivery milestones, and GPS route polylines using Leaflet maps
- **3D Interactive Experience** — immersive WebGL logistics scene and package inspection powered by Three.js and React Three Fiber
- **24/7 AI Support Assistant** — conversational customer support widget powered by the Groq LLM API
- **Privacy by Design** — public tracking endpoints sanitize sensitive customer records and mask phone numbers

---

## ✨ Key Features

### 🏢 Multi-Role Portals & RBAC
- **Client Portal** — create shipment requests, specify pickup/destination cities, calculate dimensions & weights, view real-time package statuses, generate digital dispatch receipts with barcodes
- **Warehouse Operations** — intake queue (`REQUEST_CREATED`), barcode scanning, physical inspection, check-in (`WAREHOUSE_RECEIVED`), sorting, and packing (`PACKAGE_PROCESSED`)
- **Distribution Hub** — inbound transit reception (`DISTRIBUTOR_RECEIVED`), route grouping, and courier assignment (`ASSIGNED_FOR_DELIVERY`)
- **Delivery Agent Portal** — view assigned delivery queue, update parcels to Out for Delivery (`OUT_FOR_DELIVERY`), capture final delivery confirmation (`DELIVERED`)
- **Admin Control Center** — system-wide operational overview, real-time activity logs, user role management, hub explorer, and volume analytics

### 🔄 State-Machine Verification Engine
Enforced server-side via `utils/statusEngine.js`:
- **Standard Flow:** `REQUEST_CREATED` → `WAREHOUSE_RECEIVED` → `PACKAGE_PROCESSED` → `DISTRIBUTOR_RECEIVED` → `ASSIGNED_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`
- **Express Flow:** `REQUEST_CREATED` → `DISTRIBUTOR_RECEIVED` → `ASSIGNED_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED` (skips warehouse intake)
- Every transition generates an immutable audit snapshot in `PackageHistory` (handler, timestamp, comments, location)

### 📍 Real-Time Tracking & Route Maps
- Public package tracking by ID — no account required
- Dynamic milestone progress bar (Created → Intake → Transit → Delivered)
- Interactive Leaflet map with origin, transit hubs, and destination
- Masked phone numbers (`••••••3210`) and sanitized client data on public endpoints

### 🤖 AI Support Assistant
- Floating chat widget on all pages
- Powered by the Groq API (`qwen/qwen3.8-27b` / `groq/compound-mini`) with multi-model fallback
- Handles shipment tracking, process questions, and human escalation

### 🎨 Modern UI & 3D Visuals
- Dark-mode aesthetic with glassmorphism
- 3D interactive parcel and conveyor animations (Three.js / React Three Fiber)
- Responsive across mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.8 | Core UI library |
| Vite | ^8.2.2 | Build tool & dev server |
| React Router DOM | ^7.18.2 | Routing & protected routes |
| Tailwind CSS | ^4.3.3 | Styling |
| Three.js | ^0.185.1 | 3D graphics |
| @react-three/fiber | ^9.7.0 | React renderer for Three.js |
| @react-three/drei | ^10.7.8 | Three.js helpers |
| Framer Motion | ^13.1.1 | Animations & transitions |
| Leaflet / React Leaflet | ^1.9.4 / ^5.0.0 | Interactive GPS maps |
| Recharts | ^3.10.1 | Analytics charts |
| Sonner | ^2.0.8 | Toast notifications |
| Axios | ^1.19.0 | HTTP client |
| ESLint | ^10.9.0 | Linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | >=16.0.0 | Runtime |
| Express | ^4.19.2 | Web framework & REST routing |
| MongoDB / Mongoose | ^8.3.1 | Database & schema modeling |
| mongodb-memory-server | ^11.2.0 | Embedded MongoDB for tests / fallback |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| CORS | ^2.8.5 | Cross-origin handling with production guard |
| dotenv | ^16.4.5 | Environment variables |
| Swagger UI Express | ^5.0.1 | Interactive API docs (`/api-docs`) |
| Groq Cloud API | REST | LLM inference for AI chat |

---

## 📁 Repository Structure

```
LOGITRACK/
├── backend/
│   ├── config/            # DB connection + Swagger spec
│   ├── controllers/       # admin, auth, delivery, distributor, package, warehouse
│   ├── middleware/        # auth (JWT) + roles (RBAC)
│   ├── models/            # Counter, Package, PackageHistory, User
│   ├── routes/            # Express route declarations
│   ├── scripts/           # seed.js, test.js (42-assertion test suite)
│   ├── utils/             # idGenerator, statusEngine
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── animations/    # Framer Motion variants
│   │   ├── components/    # 3d, chat, landing, navigation, ui
│   │   ├── config/        # api.js (VITE_API_URL)
│   │   ├── context/       # Auth, Theme, LandingScroll
│   │   ├── data/          # cities directory + GPS coordinates
│   │   ├── pages/         # client, warehouse, admin, delivery, distributor, landing, tracking
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── eslint.config.js
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18.0.0+
- npm v9.0.0+
- MongoDB — a local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster. *(If no MongoDB is detected, the backend automatically falls back to an in-memory database via `mongodb-memory-server`.)*

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_USERNAME>/logistics-tracking.git
cd logistics-tracking
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run seed            # seeds demo users & shipments
npm run dev              # or: npm start
```
Backend runs at `http://localhost:5000`. Interactive API docs: `http://localhost:5000/api-docs`.

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```
Open `http://localhost:5173`.

### Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRE` | Token expiry (e.g. `24h`) |
| `FRONTEND_URL` | Deployed frontend URL (for CORS) |
| `NODE_ENV` | `development` or `production` |
| `GROQ_API_KEY` | API key for the Groq chat assistant |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

> ⚠️ Never commit real `.env` files — only `.env.example` with placeholder values should be tracked in git.

---

## 🔑 Demo Login Accounts

After `npm run seed`, the following accounts are available. All share the password **`password123`**.

| Role | Email | Access |
|---|---|---|
| Admin | `admin@logistics.edu` | Full administrative oversight |
| Client | `kaushaljoshi311@gmail.com` | Create & track shipments |
| Client | `chemistry@logistics.edu` | Active express & delivered shipments |
| Warehouse | `warehouse@logistics.edu` | Check-in, sort & pack |
| Distributor | `distributor@logistics.edu` | Hub reception, driver assignment |
| Delivery | `alice@logistics.edu` | Assigned out-for-delivery packages |
| Delivery | `bob@logistics.edu` | Assigned transit packages |

> These are seeded demo credentials for local development only — never reuse them against a production database with real user data.

---

## 🧪 Testing & Validation

```bash
cd backend
npm test
```

**Coverage (42 assertions across 13 suites):** role seeding & password hashing, JWT auth, atomic package ID generation, RBAC route protection, cross-client data isolation, state-machine validation (including express-flow bypass), courier/driver isolation, input validation, negative auth edge cases, public tracking privacy (phone masking, email stripping), terminal-state protection, and the Groq chat integration.

```bash
cd frontend
npm run lint    # 0 errors
npm run build   # production bundle in frontend/dist/
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Authenticate & return JWT |
| GET | `/api/auth/me` | Private | Get authenticated user profile |
| POST | `/api/auth/forgot-password` | Public | Secure password recovery |
| GET | `/api/packages/public/track/:packageId` | Public | Sanitized public tracking |
| GET | `/api/packages/public/track/:packageId/history` | Public | Public milestone timeline |
| POST | `/api/packages` | Client | Create a delivery request |
| GET | `/api/packages/my` | Client | List own packages |
| GET | `/api/packages/:packageId` | Authenticated | Detailed package view |
| GET | `/api/warehouse/packages` | Warehouse | Actionable warehouse queue |
| PATCH | `/api/warehouse/packages/:packageId/receive` | Warehouse | Intake scan & check-in |
| PATCH | `/api/warehouse/packages/:packageId/process` | Warehouse | Sort & pack |
| GET | `/api/distributor/packages` | Distributor | Actionable hub queue |
| PATCH | `/api/distributor/packages/:packageId/receive` | Distributor | Receive at hub |
| PATCH | `/api/distributor/packages/:packageId/assign` | Distributor | Assign to driver |
| GET | `/api/distributor/drivers` | Distributor | List available drivers |
| GET | `/api/delivery/packages` | Delivery | List assigned packages |
| PATCH | `/api/delivery/packages/:packageId/out-for-delivery` | Delivery | Mark in-transit |
| PATCH | `/api/delivery/packages/:packageId/deliver` | Delivery | Confirm delivery |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/packages` | Admin | List all packages |
| POST | `/api/chat` | Public | Groq AI support chat |
| GET | `/api-docs` | Public | Swagger API documentation |

---

## 🌐 Production Deployment

### Backend (Render / Railway / AWS / Heroku)
- Root directory: `backend/`
- Build: `npm install` · Start: `npm start`
- Environment: `NODE_ENV=production`, `PORT`, `MONGO_URI` (rotated credentials), `JWT_SECRET` (fresh, random), `JWT_EXPIRE`, `FRONTEND_URL`, `GROQ_API_KEY`

### Frontend (Vercel / Netlify / Cloudflare Pages)
- Root directory: `frontend/`
- Build: `npm run build` · Output: `dist`
- Environment: `VITE_API_URL` (backend URL, no trailing slash)

---

## 🛡️ Security Highlights
- No hardcoded secrets — real `.env` files are gitignored; `.env.example` holds only placeholders
- All queries strictly scoped by authenticated user ID with validated inputs
- PII (phone numbers, emails) stripped or masked on public endpoints
- Strict CORS whitelist enforced in production
- Graceful shutdown on `uncaughtException` / `unhandledRejection`

---

## 📄 License

No license has been added yet — all rights reserved by default. Add a `LICENSE` file (e.g. MIT) if you intend to open-source this project.