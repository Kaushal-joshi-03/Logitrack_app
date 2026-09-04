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

Key highlights:
- **Strict Transition Engine**: Implements a server-side state-machine matrix enforcing valid status progressions across **Standard Flow** and **Express Flow** routes.
- **Role-Based Access Control (RBAC)**: Enforces granular permissions for **Clients**, **Warehouse Workers**, **Distributor Hub Managers**, **Couriers / Delivery Agents**, and **System Administrators**.
- **Interactive Geospatial Tracking**: Plots real-time shipment progress, delivery milestones, and GPS route polylines using Leaflet maps.
- **3D Interactive Experience**: Immersive WebGL logistics scene and package inspection powered by Three.js and React Three Fiber.
- **24/7 AI Support Assistant**: Integrated conversational customer support widget powered by Groq LLM API.
- **Privacy by Design**: Public tracking endpoints sanitize sensitive customer records and mask phone numbers.

---

## ✨ Key Features

### 🏢 1. Multi-Role Portals & RBAC
- **Client Portal**: Create shipment requests, specify pickup/destination Indian cities, calculate dimensions & weights, view real-time package statuses, and generate digital dispatch receipts with barcodes.
- **Warehouse Operations**: Intake queue (`REQUEST_CREATED`), barcode scanning, physical inspection, package check-in (`WAREHOUSE_RECEIVED`), sorting, and packing (`PACKAGE_PROCESSED`).
- **Distribution Hub**: Inbound transit reception (`DISTRIBUTOR_RECEIVED`), route grouping, and courier driver assignment (`ASSIGNED_FOR_DELIVERY`).
- **Delivery Agent Portal**: View assigned delivery queue, update parcels to Out for Delivery (`OUT_FOR_DELIVERY`), and capture final delivery confirmation (`DELIVERED`).
- **Admin Control Center**: System-wide operational overview, real-time shipment activity logs, multi-user role management, network coverage hub explorer, and logistics volume analytics.

### 🔄 2. State-Machine Verification Engine
The backend enforces status transition rules via `utils/statusEngine.js`:
- **Standard Flow**: `REQUEST_CREATED` → `WAREHOUSE_RECEIVED` → `PACKAGE_PROCESSED` → `DISTRIBUTOR_RECEIVED` → `ASSIGNED_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`
- **Express Flow**: Bypasses warehouse intake directly from `REQUEST_CREATED` → `DISTRIBUTOR_RECEIVED` → `ASSIGNED_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`
- Every status transition automatically generates an immutable audit snapshot in `PackageHistory` recording the handler, timestamp, comments, and location.

### 📍 3. Real-Time Tracking & Route Maps
- Track packages publicly by ID without requiring an account.
- Dynamic milestone progress bar (Created → Intake → Transit → Delivered).
- Interactive Leaflet map plotting origin, transit hubs, and destination coordinates.
- Masked customer phone numbers (`••••••3210`) and sanitized client data on public endpoints.

### 🤖 4. AI Support Assistant
- Floating chat assistant on all pages.
- Powered by the Groq API (`qwen/qwen3.8-27b` / `groq/compound-mini`) with fast multi-model fallbacks.
- Structured answers for shipment tracking, warehouse processes, and human escalation contacts.

### 🎨 5. Modern UI & 3D Visuals
- High-performance dark-mode aesthetic with CSS grid backdrops and glassmorphism.
- 3D interactive parcel and conveyor animations via Three.js / React Three Fiber.
- Responsive design tailored for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `^19.2.8` | Core UI library |
| **Vite** | `^8.2.2` | Next-generation build tool & dev server |
| **React Router DOM** | `^7.18.2` | Client-side routing & protected routes |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling framework |
| **Three.js** | `^0.185.1` | 3D graphics rendering |
| **@react-three/fiber** | `^9.7.0` | React renderer for Three.js |
| **@react-three/drei** | `^10.7.8` | Useful helpers for Three.js |
| **Framer Motion** | `^13.1.1` | Smooth layout animations and page transitions |
| **Leaflet** | `^1.9.4` | Interactive GPS mapping |
| **React Leaflet** | `^5.0.0` | React bindings for Leaflet |
| **Recharts** | `^3.10.1` | Analytical charts & delivery metrics |
| **Sonner** | `^2.0.8` | Toast notification system |
| **Axios** | `^1.19.0` | Promise-based HTTP client |
| **ESLint** | `^10.9.0` | Code quality and linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `>=16.0.0` | JavaScript runtime environment |
| **Express** | `^4.19.2` | Web framework & REST API routing |
| **MongoDB / Mongoose** | `^8.3.1` | Database ODM and schema modeling |
| **mongodb-memory-server** | `^11.2.0` | Zero-config embedded MongoDB for tests & fallback |
| **jsonwebtoken (JWT)** | `^9.0.2` | Stateless bearer token authentication |
| **bcryptjs** | `^2.4.3` | Salted password hashing |
| **CORS** | `^2.8.5` | Cross-Origin Resource Sharing with production guard |
| **dotenv** | `^16.4.5` | Environment variable management |
| **Swagger UI Express** | `^5.0.1` | Interactive OpenAPI documentation (`/api-docs`) |
| **Groq Cloud API** | REST | High-speed LLM inference for AI Support Chat |

---

## 📁 Repository Structure

```
LOGITRACK/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB Atlas connection + In-Memory fallback
│   │   └── swagger.js            # Swagger / OpenAPI 3.0 specification
│   ├── controllers/
│   │   ├── adminController.js     # Analytics, user management, and all-package views
│   │   ├── authController.js      # Register, login, profile, and password recovery
│   │   ├── deliveryController.js   # Assigned driver routes, out-for-delivery, deliver
│   │   ├── distributorController.js# Hub reception, driver listing, and assignment
│   │   ├── packageController.js   # Creation, client shipments, and public tracking
│   │   └── warehouseController.js # Intake, scan check-in, sorting, and processing
│   ├── middleware/
│   │   ├── auth.js                # JWT verification & req.user extraction
│   │   └── roles.js               # Role-based route authorization
│   ├── models/
│   │   ├── Counter.js             # Atomic auto-increment sequence generator
│   │   ├── Package.js             # Package schema & lifecycle status
│   │   ├── PackageHistory.js      # Immutable audit trail for all transitions
│   │   └── User.js                # User schema with bcrypt password hashing
│   ├── routes/                    # Express route declarations
│   ├── scripts/
│   │   ├── seed.js                # Database seeding script (demo users & shipments)
│   │   └── test.js                # Automated integration & security test suite (42 tests)
│   ├── utils/
│   │   ├── idGenerator.js         # PKG-YYYY-XXXXXX generator
│   │   └── statusEngine.js        # State transition validation matrix
│   ├── .env.example               # Backend environment variables template
│   ├── package.json
│   └── server.js                  # Application entry point & middleware pipeline
│
├── frontend/
│   ├── public/                    # Favicons, SVGs, and brand assets
│   ├── src/
│   │   ├── animations/            # Framer Motion animation variants
│   │   ├── components/
│   │   │   ├── 3d/                # Three.js canvases & interactive package models
│   │   │   ├── chat/              # Floating AI Support chat widget
│   │   │   ├── landing/           # Hero marquee, parallax truck, and feature reveals
│   │   │   ├── navigation/        # Responsive Navbar, Footer, and ScrollToTop
│   │   │   └── ui/                # ProtectedRoute and SearchableSelect components
│   │   ├── config/
│   │   │   └── api.js             # Centralized API base URL config (VITE_API_URL)
│   │   ├── context/               # Auth, Theme, and LandingScroll contexts
│   │   ├── data/                  # Indian cities directory and GPS coordinates
│   │   ├── pages/
│   │   │   ├── client/            # Client dashboard & shipment creation
│   │   │   ├── warehouse/         # Warehouse dashboard, scan, and receive pages
│   │   │   ├── AdminDashboard.jsx # Admin control center, users, and shipments
│   │   │   ├── DeliveryDashboard.jsx # Courier route view & delivery completion
│   │   │   ├── DistributorDashboard.jsx # Hub management & driver dispatch
│   │   │   ├── LandingPage.jsx    # Hero landing page & quick tracking
│   │   │   └── Tracking.jsx       # Real-time tracking view & Leaflet route map
│   │   ├── App.jsx                # Main application routes & provider tree
│   │   ├── index.css              # Tailwind CSS imports & custom tokens
│   │   └── main.jsx               # React DOM root render
│   ├── .env.example               # Frontend environment variables template
│   ├── eslint.config.js           # ESLint 10 flat configuration
│   ├── package.json
│   └── vite.config.js             # Vite configuration with Tailwind CSS plugin
│
├── .gitignore                     # Git ignore rules covering .env, build, and node_modules
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI. *(Note: If no MongoDB is detected, the backend will automatically launch an in-memory database using `mongodb-memory-server`!)*

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/logistics-tracking.git
cd logistics-tracking
```

---

### Step 2: Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and configure your variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/logistics-tracking?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=24h
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   GROQ_API_KEY=your_groq_api_key_here
   ```
   > **Note on MongoDB**: If you leave `MONGO_URI` empty or if your network blocks Atlas SRV ports, the server automatically starts a local in-memory database and auto-seeds demo data!

4. **Seed the Database with Demo Accounts**:
   ```bash
   npm run seed
   ```

5. **Start the Backend Server**:
   ```bash
   # Development mode with hot-reloading:
   npm run dev

   # Or standard start:
   npm start
   ```
   The backend API will run at `http://localhost:5000`.  
   Interactive API docs are available at: `http://localhost:5000/api-docs`.

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Accounts

After running `npm run seed` in the backend, the following accounts are ready to use. All accounts share the same password: **`password123`**

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@logistics.edu` | `password123` | Full administrative oversight, all shipments, user roles |
| **Client** | `physics@logistics.edu` | `password123` | Create shipments, track packages, view client dashboard |
| **Client** | `chemistry@logistics.edu` | `password123` | Lab client with active express and delivered shipments |
| **Warehouse** | `warehouse@logistics.edu` | `password123` | Check-in scan, receive package, sort & pack |
| **Distributor** | `distributor@logistics.edu` | `password123` | Regional hub reception, view drivers, assign couriers |
| **Delivery** | `alice@logistics.edu` | `password123` | Assigned driver for active out-for-delivery packages |
| **Delivery** | `bob@logistics.edu` | `password123` | Assigned driver for assigned transit packages |

---

## 🧪 Testing & Validation

LogiTrack includes a comprehensive automated test suite testing the entire lifecycle, negative scenarios, authentication edge cases, and RBAC isolation using an isolated in-memory database.

### 1. Run the Backend Test Suite
```bash
cd backend
npm test
```
**Test Coverage Breakdown (42 Assertions)**:
- ✅ **Test 1**: User role seeding & password encryption
- ✅ **Test 2**: Authentication & JWT token generation
- ✅ **Test 3**: Atomic Package ID incrementing (`PKG-2026-000001` format) & express flow tags
- ✅ **Test 4**: RBAC route protections (403 forbidden vs 200)
- ✅ **Test 5**: Cross-client data isolation (clients cannot view other clients' orders)
- ✅ **Test 6**: State machine validation (cannot jump steps; automated timeline tracking)
- ✅ **Test 7**: Express bypass validation (skips warehouse directly to distributor)
- ✅ **Test 8**: Courier assignment & driver isolation (driver B blocked from driver A orders)
- ✅ **Test 9**: Package input validation (rejection of negative, non-numeric, or missing weight)
- ✅ **Test 10**: Negative auth edge-cases (wrong password, duplicate registration, tampered JWT)
- ✅ **Test 11**: Public tracking data privacy (phone masking & stripping customer email)
- ✅ **Test 12**: Terminal state transitions (blocks mutation of delivered shipments)
- ✅ **Test 13**: Groq AI support chat endpoint integration

### 2. Run Frontend Linting
```bash
cd frontend
npm run lint
```
Passes cleanly with **0 errors**.

### 3. Build the Frontend for Production
```bash
cd frontend
npm run build
```
Creates an optimized, minified production bundle in `frontend/dist/`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | Public | Register new user with validated email and role |
| **POST** | `/api/auth/login` | Public | Authenticate user & return JWT token |
| **GET** | `/api/auth/me` | Private | Retrieve authenticated user profile |
| **POST** | `/api/auth/forgot-password` | Public | Secure password recovery dispatch |
| **GET** | `/api/packages/public/track/:packageId` | Public | Public sanitized package details & masked contacts |
| **GET** | `/api/packages/public/track/:packageId/history` | Public | Public milestone events and timeline logs |
| **POST** | `/api/packages` | Client | Submit a new delivery request |
| **GET** | `/api/packages/my` | Client | Retrieve packages created by logged-in client |
| **GET** | `/api/packages/:packageId` | Authorized | Authenticated detailed package view |
| **GET** | `/api/warehouse/packages` | Warehouse | List actionable warehouse packages |
| **PATCH**| `/api/warehouse/packages/:packageId/receive` | Warehouse | Intake scan & check-in |
| **PATCH**| `/api/warehouse/packages/:packageId/process` | Warehouse | Sort, pack, and prepare for distribution |
| **GET** | `/api/distributor/packages` | Distributor | List actionable distributor hub packages |
| **PATCH**| `/api/distributor/packages/:packageId/receive` | Distributor | Receive package at regional hub |
| **PATCH**| `/api/distributor/packages/:packageId/assign` | Distributor | Assign package to delivery person |
| **GET** | `/api/distributor/drivers` | Distributor | List available delivery agents |
| **GET** | `/api/delivery/packages` | Delivery | List packages assigned to authenticated driver |
| **PATCH**| `/api/delivery/packages/:packageId/out-for-delivery` | Delivery | Mark package loaded into vehicle & in-transit |
| **PATCH**| `/api/delivery/packages/:packageId/deliver` | Delivery | Confirm final package delivery |
| **GET** | `/api/admin/users` | Admin | List all registered users |
| **GET** | `/api/admin/packages` | Admin | List all packages across all clients |
| **POST** | `/api/chat` | Public | Interact with Groq AI Support Assistant |
| **GET** | `/api-docs` | Public | Interactive Swagger API Documentation |

---

## 🌐 Production Deployment Guide

### Deploying the Backend (Render / Railway / AWS / Heroku)
1. Set the root directory to `backend/`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure Production Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/logistics-tracking?retryWrites=true&w=majority`
   - `JWT_SECRET=<generate_secure_random_key>`
   - `JWT_EXPIRE=24h`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `GROQ_API_KEY=<your_groq_api_key>`

### Deploying the Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the root directory to `frontend/`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Configure Build Environment Variables:
   - `VITE_API_URL=https://your-backend-api.com` *(without trailing slash)*

---

## 🛡️ Security Highlights
- **No Hardcoded Secrets**: Real `.env` files are strictly gitignored; `.env.example` templates contain only non-sensitive placeholders.
- **SQL / NoSQL Sanitization**: All queries strictly scoped by user ID and validated inputs.
- **Public Data Protection**: PII (phone numbers, user emails) stripped or masked on public endpoints.
- **Strict CORS Verification**: Whitelist enforced for non-local production domains.
- **Process Exception Safeguards**: Graceful shutdown on `uncaughtException` and `unhandledRejection`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
