# Antigravity Build Prompt — MERN Logistics Tracking Backend

**This replaces the earlier FastAPI/Postgres prompt.** You're now building on Node.js +
Express + MongoDB per your master prompt. Send the layers below **in order, one at a time**,
reviewing each before moving to the next.

Note the shape here is different from the Python version on purpose: your master prompt
explicitly wants a **documentation blueprint produced first**, and implementation only after
that blueprint exists. Layer 1 respects that instead of jumping straight to code.

---

## LAYER 1 — Documentation Blueprint (no code yet)

```
Act as a Senior Software Architect, MERN Stack Developer, Database Designer, and Technical
Documentation Writer. Do NOT write any implementation code in this step.

Produce a complete technical documentation / implementation blueprint for a college-level
MERN Logistics Tracking System, covering the following (use these as section headers):

1. Project Overview & Problem Statement
2. User Roles & Permissions (Client, Warehouse, Distributor, Delivery Person, Admin)
3. Business Workflow (Client creates a "Delivery Request", not a "package" — the backend
   generates the Package ID once the request is created)
4. Package Lifecycle & Status Transition Table (current status → allowed next status →
   allowed role → API endpoint) — must support BOTH the warehouse and no-warehouse flow:
   Flow A: REQUEST_CREATED → WAREHOUSE_RECEIVED → PACKAGE_PROCESSED → DISTRIBUTOR_RECEIVED
           → ASSIGNED_FOR_DELIVERY → OUT_FOR_DELIVERY → DELIVERED
   Flow B: REQUEST_CREATED → DISTRIBUTOR_RECEIVED → ASSIGNED_FOR_DELIVERY
           → OUT_FOR_DELIVERY → DELIVERED
5. MongoDB Schema Design for: Users, Packages, PackageHistory
   - Explicitly decide and justify: should PackageHistory reference the Package's ObjectId,
     or store packageId directly? State the decision and the reasoning.
   - Explain how Package ID uniqueness (PKG-YYYY-XXXXXX) is guaranteed in MongoDB.
6. Database relationships (ER-style explanation despite NoSQL)
7. Authentication (JWT) & Authorization (RBAC) design, with explicit middleware responsibilities
8. Complete REST API documentation — every endpoint from the role list below, each with:
   method, URL, auth required, required role, request body, validation rules, success
   response, error responses, example request/response
9. Frontend/backend integration contract: API-to-UI mapping table, and a database-operation
   mapping table for at least "Create Delivery Request" and "Mark Delivered"
10. Error handling conventions (consistent { success, message, data } shape)
11. Sample seed data (1 admin, 2 clients, 1 warehouse, 1 distributor, 2 delivery persons,
    several packages at different lifecycle stages) with dev-only credentials clearly labeled
12. Edge cases to handle (duplicate package ID, out-of-order status changes, cross-user
    access attempts, expired JWT, etc.)
13. Folder structure for backend/ (config, controllers, middleware, models, routes, utils)
    and frontend/ (components, pages, layouts, services, context, routes)
14. Environment variables for both frontend and backend, with a short explanation of each
15. Final Implementation Checklist

Constraints: MERN only (Node, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors) —
no Python, no microservices, no Kafka/Redis/Kubernetes, no WebSockets, no GPS/notifications/
payments (list those only under "Future Enhancements", out of scope now).

Output this as a single structured document. Do not generate implementation code yet —
that happens in the next step, using this document as the source of truth.
```

Review this output carefully before moving on — especially the status-transition table and
the PackageHistory reference decision. Everything in Layer 2 is built directly from what
gets locked in here.

---

## LAYER 2 — Backend Implementation (build strictly from the Layer 1 blueprint)

```
Using the documentation blueprint you just produced as the source of truth, now implement
the BACKEND ONLY (Node.js + Express + MongoDB + Mongoose). Do not build any frontend code.

1. Scaffold backend/ with: config/, controllers/, middleware/, models/, routes/, utils/,
   server.js, .env.example, package.json, README.md (stub for now)

2. Mongoose models for User, Package, PackageHistory exactly matching the schema design
   from the blueprint (including your decision on how PackageHistory references packages).

3. Auth:
   - POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
   - bcryptjs password hashing, JWT sign/verify
   - middleware/auth.js for "who is logged in", middleware/roles.js (or similar) for
     "is this role allowed to hit this route" — reusable across all routers

4. Status transition engine (in a service/util, not inline in controllers):
   - Encode the full status → allowed-next-status(es) → allowed-role map from the blueprint
   - Reject invalid transitions with a 400 and a clear message
   - Every successful transition creates a PackageHistory document — no exceptions

5. Package ID generation: PKG-{year}-{zero-padded sequence}, unique, sequence resets per
   year — handle the uniqueness/race condition reasonably for a college project.

6. Routes/controllers for every endpoint documented in Layer 1's API section:
   Client: POST /api/packages, GET /api/packages/my, GET /api/packages/:packageId,
           GET /api/packages/:packageId/history
   Warehouse: GET /api/warehouse/packages, PATCH .../receive, PATCH .../process
   Distributor: GET /api/distributor/packages, PATCH .../receive, PATCH .../assign
   Delivery: GET /api/delivery/packages, PATCH .../out-for-delivery, PATCH .../deliver
   Admin: GET /api/admin/users, GET /api/admin/packages, GET /api/admin/packages/:packageId/history

7. Consistent response shape everywhere:
   Success: { "success": true, "message": "...", "data": {} }
   Error:   { "success": false, "message": "..." }

8. CORS configured against FRONTEND_URL from .env (default http://localhost:5173).

Show me the full folder tree and all controller/model/middleware code once done.
```

---

## LAYER 3 — Data, Docs & Postman-Readiness (verification layer)

```
Final step — make this backend fully testable in Postman before any frontend exists.

1. Seed script creating the sample data from the blueprint: 1 admin, 2 clients, 1 warehouse,
   1 distributor, 2 delivery persons, plus several packages at different lifecycle stages
   (including at least one that skipped the warehouse step). Same dev password across
   accounts, clearly stated in README, clearly labeled as dev-only.

2. backend/README.md containing:
   - Exact local setup (npm install, .env setup, MongoDB connection — Atlas or local,
     npm run dev / node server.js)
   - Every endpoint: method, path, required role, request body, response shape, error codes
   - Seed account credentials
   - Example curl commands for: login, create delivery request, one status transition

3. Sanity checks before finishing:
   - Every PATCH route rejects a role that shouldn't call it
   - Invalid status transitions return 400 with a readable message
   - PackageHistory gets a new document on every transition, with correct updatedBy/timestamp
   - GET .../:packageId works by the human-readable Package ID, not the Mongo _id
   - A Delivery Person cannot fetch or modify a package not assigned to them
   - A Client cannot fetch another client's package

4. Give exact commands to run the backend locally from a clean checkout.

Do not touch frontend code — that comes in a separate prompt.
```

---

### Notes before you start
- Since Antigravity previously defaulted to a newer runtime than your system had (Python 3.14
  vs 3.13), check `node --version` against whatever Antigravity assumes for Node too — same
  class of mismatch can happen with `npm install` failing on native deps.
- Keep your `.env` (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`) out of anything you paste back
  to me or commit to git.
- Once Layer 3 is done and you're green in Postman, send the frontend prompt and I'll build
  its layers against this exact API contract (endpoints, response shapes, and status table).
