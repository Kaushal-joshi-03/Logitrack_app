# Logistics Tracking System - Backend API Documentation

This is the backend API server for the college-level MERN Logistics Tracking System. It is built using Node.js, Express, MongoDB, and Mongoose.

---

## Getting Started

### Prerequisites
* **Node.js**: v16.0.0 or higher (Tested on v26.3.0)
* **MongoDB**: A running instance (local MongoDB community server or a MongoDB Atlas cluster URI)

### Local Setup Instructions
1. **Clone/Checkout the Repository** and navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   * Create a `.env` file in the `backend/` directory.
   * Copy the values from `.env.example` and replace them with your actual configuration:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/logistics-tracking
     JWT_SECRET=your_super_secret_jwt_key_here
     JWT_EXPIRE=24h
     FRONTEND_URL=http://localhost:5173
     NODE_ENV=development
     ```
4. **Seed the Database**:
   Pre-populate the database with the required mock user accounts and sample packages at different lifecycle stages.
   ```bash
   npm run seed
   ```
5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The backend API will be running at `http://localhost:5000`.

---

## Seed Accounts (Development Credentials)
All seed accounts use the default password: **`password123`**

| Role | Name | Email | Initial Seed Packages |
|---|---|---|---|
| **Admin** | Chief Operator | `admin@logistics.edu` | View access to all packages and users |
| **Client** | Department of Physics | `physics@logistics.edu` | Owns `PKG-2026-000001` (REQUEST_CREATED) and `PKG-2026-000002` (WAREHOUSE_RECEIVED) |
| **Client** | Lab Chemistry | `chemistry@logistics.edu` | Owns `PKG-2026-000003` (DELIVERED) |
| **Warehouse** | Warehouse Admin | `warehouse@logistics.edu` | Access to manage Flow A (standard route) check-in & processing |
| **Distributor**| Hub Manager | `distributor@logistics.edu` | Access to manage distributor reception and driver assignment |
| **Delivery** | Courier Alice | `alice@logistics.edu` | Assigned driver for `PKG-2026-000003` |
| **Delivery** | Courier Bob | `bob@logistics.edu` | Assigned driver for `PKG-2026-000004` (ASSIGNED_FOR_DELIVERY) |

---

## API Reference

### Response Formats

#### Success Response (200 OK / 201 Created)
```json
{
  "success": true,
  "message": "Description of operations",
  "data": { ... }
}
```

#### Error Response (400 / 401 / 403 / 404 / 500)
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

### Auth Endpoints (`/api/auth`)

#### 1. Register User
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Auth**: None
* **Body**:
  ```json
  {
    "name": "Full Name",
    "email": "user@example.com",
    "password": "mypassword123",
    "role": "client" // client, warehouse, distributor, delivery_person, admin
  }
  ```

#### 2. Login User
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Auth**: None
* **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "mypassword123"
  }
  ```

#### 3. Get Logged-In User Profile
* **Method**: `GET`
* **Path**: `/api/auth/me`
* **Auth**: JWT Bearer token required

---

### Client Endpoints (`/api/packages`)

#### 1. Create Delivery Request
* **Method**: `POST`
* **Path**: `/api/packages`
* **Auth**: Client role required
* **Body**:
  ```json
  {
    "description": "Package contents description",
    "weight": 2.5, // in kg
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "flowType": "standard" // standard or express
  }
  ```

#### 2. Get My Packages
* **Method**: `GET`
* **Path**: `/api/packages/my`
* **Auth**: Client role required

#### 3. Get Package Details
* **Method**: `GET`
* **Path**: `/api/packages/:packageId` (e.g. `/api/packages/PKG-2026-000001`)
* **Auth**: Any role (Clients are restricted to viewing only their own packages. Delivery drivers are restricted to packages assigned to them).

#### 4. Get Package History
* **Method**: `GET`
* **Path**: `/api/packages/:packageId/history`
* **Auth**: Any role (Same data isolation rules as details check).

---

### Warehouse Endpoints (`/api/warehouse`)

#### 1. Get Actionable Packages
* **Method**: `GET`
* **Path**: `/api/warehouse/packages`
* **Auth**: Warehouse role required

#### 2. Receive Package
* **Method**: `PATCH`
* **Path**: `/api/warehouse/packages/:packageId/receive`
* **Auth**: Warehouse role required
* **Body**:
  ```json
  {
    "location": "Warehouse Bin A-2",
    "comments": "Inspected, no external damage"
  }
  ```

#### 3. Process Package
* **Method**: `PATCH`
* **Path**: `/api/warehouse/packages/:packageId/process`
* **Auth**: Warehouse role required
* **Body**:
  ```json
  {
    "location": "Sorting Line 1",
    "comments": "Sorted and boxed for distributor shuttle"
  }
  ```

---

### Distributor Endpoints (`/api/distributor`)

#### 1. Get Actionable Packages
* **Method**: `GET`
* **Path**: `/api/distributor/packages`
* **Auth**: Distributor role required

#### 2. Receive Package at Hub
* **Method**: `PATCH`
* **Path**: `/api/distributor/packages/:packageId/receive`
* **Auth**: Distributor role required
* **Body**:
  ```json
  {
    "location": "Main Sorting Hub",
    "comments": "Unloaded from shuttle route A"
  }
  ```

#### 3. Assign Package for Delivery
* **Method**: `PATCH`
* **Path**: `/api/distributor/packages/:packageId/assign`
* **Auth**: Distributor role required
* **Body**:
  ```json
  {
    "deliveryPersonId": "60d5ec49f39a3e2c349a1f99",
    "comments": "Assigned to Bob for morning route"
  }
  ```

---

### Delivery Endpoints (`/api/delivery`)

#### 1. Get My Assigned Packages
* **Method**: `GET`
* **Path**: `/api/delivery/packages`
* **Auth**: Delivery Person role required

#### 2. Mark Package Out for Delivery
* **Method**: `PATCH`
* **Path**: `/api/delivery/packages/:packageId/out-for-delivery`
* **Auth**: Delivery Person role required (Must be assigned driver)
* **Body**:
  ```json
  {
    "comments": "Loaded into delivery van"
  }
  ```

#### 3. Mark Package Delivered
* **Method**: `PATCH`
* **Path**: `/api/delivery/packages/:packageId/deliver`
* **Auth**: Delivery Person role required (Must be assigned driver)
* **Body**:
  ```json
  {
    "comments": "Delivered to recipient signature on file"
  }
  ```

---

### Admin Endpoints (`/api/admin`)

#### 1. Get All Users
* **Method**: `GET`
* **Path**: `/api/admin/users`
* **Auth**: Admin role required

#### 2. Get All Packages
* **Method**: `GET`
* **Path**: `/api/admin/packages`
* **Auth**: Admin role required

#### 3. Get History for Any Package
* **Method**: `GET`
* **Path**: `/api/admin/packages/:packageId/history`
* **Auth**: Admin role required

---

## Example Curl Commands

### 1. User Login (Retrieve JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "physics@logistics.edu", "password": "password123"}'
```

### 2. Create Delivery Request (Client)
*Replace `<token>` with the JWT returned from the login response.*
```bash
curl -X POST http://localhost:5000/api/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"description": "Seismic sensor replacement", "weight": 5.4, "dimensions": {"length": 40, "width": 40, "height": 30}, "flowType": "standard"}'
```

### 3. Receive Package at Warehouse (Warehouse)
*Replace `<token>` with the Warehouse account JWT.*
```bash
curl -X PATCH http://localhost:5000/api/warehouse/packages/PKG-2026-000001/receive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"location": "Dock A Reception", "comments": "Checked in successfully"}'
```
