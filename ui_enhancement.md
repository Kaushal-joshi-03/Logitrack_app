# Antigravity Build Prompt — LogiTrack Dashboard UI Enhancement

Current state: a single centered card with an empty-state message. Target: a persistent
sidebar + stat cards + filterable table layout, in the style of Delhivery/Bluedart/Shiprocket
operations dashboards. Send these layers in order, reviewing each before the next.

---

## LAYER 1 — Layout shell & design tokens (no page content logic yet)

```
Rebuild the app shell for LogiTrack (React + Tailwind). Do NOT touch page-specific logic
yet — this step is purely the persistent layout frame and design tokens.

1. Design tokens (Tailwind config or CSS variables):
   - Keep the existing dark theme, but define these as reusable tokens instead of one-off
     classes: surface-page, surface-card, surface-card-muted, border-default, text-primary,
     text-secondary, text-muted, accent (indigo/purple, matches current branding), plus
     semantic status colors: success (green), warning (amber), info (blue), danger (red) —
     each needs a background tint and a matching darker text color for badges.
   - Two font weights only: 400 regular, 500 medium. No 600/700 anywhere.

2. Persistent shell layout (applies to every authenticated route):
   - Left sidebar, ~200-220px wide, fixed height, containing: logo/wordmark at top, then
     nav items with icon + label (use lucide-react icons). Highlight the active route with
     a subtle background tint, not a bright color block.
   - Top bar inside the main content area (not full page width) with: page title + subtitle
     on the left, primary action button on the right (e.g. "New delivery request").
   - Main content area scrolls independently of the sidebar.
   - Sidebar nav items differ per role — build this as a config object
     (role → array of {label, icon, path}) rather than hardcoding per page, since all 5
     roles need this shell with different nav items.

3. Reusable primitives to build now, used everywhere later:
   - StatCard component: label (small, muted) + value (large, medium weight), optional
     accent color for the value text
   - StatusBadge component: takes a status enum value, renders a pill with the right
     semantic color and a human-readable label (map REQUEST_CREATED → "Request created",
     WAREHOUSE_RECEIVED → "Warehouse received", etc. — full mapping for all 7 statuses)
   - DataTable component: generic, takes columns + rows, renders a bordered table with a
     muted header row, hover state on rows, empty-state slot when rows is empty

Do not build the shipments table or dashboard content yet — just the shell and these
three primitives. Show me the shell rendered with placeholder content in the main area.
```

---

## LAYER 2 — Dashboard content per role (data-connected)

```
Using the shell and primitives from Layer 1, build out the actual dashboard content for
each role, connected to the real backend endpoints. Keep empty states — don't remove them,
just make them the fallback when there's genuinely zero data, not the default state.

1. Client dashboard (/client/dashboard or /dashboard/client):
   - Stat row (4 StatCards): Total shipments, In transit, Delivered, Pending pickup
     — computed client-side from GET /api/packages/my (or whatever the actual endpoint is)
   - Search bar (filters by Package ID, client-side filter is fine) + status dropdown filter
   - DataTable of shipments: Package ID (monospace font), Route (pickup → delivery), Status
     (StatusBadge), Last updated (relative time, e.g. "2h ago")
   - Row click navigates to a package detail/tracking view
   - "New delivery request" button in the top bar opens the create-request form/page

2. Warehouse dashboard: stat row (Incoming, Received, Processed today), DataTable of
   incoming packages with a "Receive" / "Process" action button per row that only appears
   when that action is valid for the package's current status.

3. Distributor dashboard: stat row (Received, Pending assignment, Out today), DataTable
   with "Receive" / "Assign delivery person" actions (assign opens a small dropdown/modal
   to pick from available delivery persons).

4. Delivery person dashboard: stat row (Assigned today, Out for delivery, Delivered today),
   DataTable of only their assigned packages, with "Mark out for delivery" / "Mark delivered"
   actions gated by current status.

5. Admin dashboard: stat row (Total users, Total packages, Active, Delivered), two tabs or
   sections — Users table and Packages table (read-heavy, no per-row actions needed beyond
   "View history").

Every action button must call the real API and reflect the result (loading state on the
button while the request is in flight, then refresh the table row's status — no full page
reload). Show me each dashboard once wired up.
```

---

## LAYER 3 — Tracking timeline, polish & empty/loading/error states

```
Final pass — this is what makes it feel like a real product instead of a prototype.

1. Package tracking/detail view: header with Package ID + current StatusBadge, route
   (pickup/delivery locations), then a vertical timeline component showing every
   package_history entry — status, who updated it, timestamp, remarks — most recent first
   or chronological (pick one, be consistent). Completed steps visually distinct from the
   current step (e.g. filled dot vs outline dot on the timeline).

2. Loading states: skeleton rows in DataTable while fetching (not a spinner replacing the
   whole page) — the shell and stat card labels should render immediately, only the values
   and rows show skeletons.

3. Empty states: keep the current "No shipments yet" pattern but reuse it inside the
   DataTable component as its empty slot, consistent styling across all 5 roles' tables.

4. Error states: failed API calls show an inline error banner in the content area (not a
   browser alert), with a retry action where sensible.

5. Responsive check: sidebar should collapse to icon-only or a drawer below ~768px width.
   This is a college project, so "works reasonably on a laptop and doesn't visibly break on
   a phone" is the bar — not full mobile-first design.

6. Confirmation dialogs for irreversible actions (e.g. "Mark delivered") — simple modal,
   not a browser confirm().

Do the same design pass across all 5 role dashboards for consistency — a Warehouse user's
table and a Client's table should look like the same product, not two different apps.
```

---

### Why this order
- **Layer 1** builds the shell and shared components once, so Layers 2 and 3 aren't
  duplicating table/badge/card markup five times across five roles.
- **Layer 2** is the actual data wiring — this is where bugs in the backend's response
  shapes will surface, so test each role's dashboard against Postman-verified responses
  before moving on.
- **Layer 3** is the difference between "functional" and "looks like Delhivery" — timelines,
  loading states, and consistent empty states are what separate a dashboard demo from a
  spreadsheet with buttons.
