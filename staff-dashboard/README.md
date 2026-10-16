# AMBER SPICE — Kitchen Operations & KDS Portal (Standalone)

Enterprise-grade, real-time Kitchen Display System (KDS), 86-Stock Manager, and Shift Z-Report portal built specifically for kitchen line cooks, sous chefs, head chefs, and expo dispatchers.

---

## 🏛️ Project Architecture

This standalone application implements the requested modular, scalable clean React + TypeScript + Redux Toolkit architecture:

```text
src/
│
├── main.tsx                  // App entry, Redux Provider setup & global CSS
├── App.tsx                   // Router outlet container
│
├── router/
│   ├── index.tsx             // createBrowserRouter routes definition
│   └── PrivateRoute.tsx      // Role-based auth guard & session protector
│
├── pages/                    // Route-level entry points only
│   ├── auth/
│   │   ├── LoginPage.tsx     // Staff PIN & email authentication view
│   │   └── RegisterPage.tsx  // Kitchen brigade onboarding view
│   ├── dashboard/
│   │   ├── DashboardPage.tsx // Live KDS 3-column ticket pipeline & manual ticket fire
│   │   ├── AnalyticsPage.tsx // Shift Z-Report, gross revenue & station breakdown
│   │   ├── Stock86Page.tsx   // Instant 86ing / inventory shortage manager
│   │   └── StaffUsersPage.tsx// Active kitchen brigade shift management
│   └── NotFoundPage.tsx      // Kitchen station 404 handler
│
├── components/               // Working layer with feature modules
│   ├── auth/
│   │   ├── components/       // LoginForm.tsx, RegisterForm.tsx
│   │   ├── hooks/            // useLogin.ts
│   │   ├── services/         // authService.ts
│   │   └── types.ts          // LoginFormData
│   │
│   ├── users/                // StaffManager.tsx
│   ├── dashboard/            // KdsPipeline.tsx, KdsTicketCard.tsx, StockManager86.tsx, TicketSlipModal.tsx
│   ├── analytics/            // ShiftZReport.tsx
│   │
│   ├── ui/                   // Reusable Design System
│   │   ├── Button.tsx        // Primary, secondary, danger, outline, ghost variants + loading state
│   │   ├── Input.tsx         // Floating labels, icons, error handling
│   │   └── Modal.tsx         // Accessible dialog with ESC dismissal & backdrop blur
│   │
│   ├── layout/               // Enterprise Layout Architecture
│   │   ├── DashboardLayout.tsx // Shell uniting Sidebar, Topbar, and aligned viewport
│   │   ├── Sidebar.tsx       // Collapsible navigation, online expo indicator & staff switch
│   │   ├── Topbar.tsx        // Live shift clock, audio chime toggle, rush mode, fullscreen
│   │   └── PageHeader.tsx    // Consistent title, badge, and action container
│   │
│   └── shared/               // Cross-feature components
│       ├── Avatar.tsx        // User avatar with online status indicator
│       ├── Badge.tsx         // Status pill indicators (success, warning, danger, primary)
│       └── PermissionGate.tsx// Role-gated feature visibility
│
├── store/                    // Redux Toolkit state management
│   ├── index.ts              // configureStore
│   ├── rootReducer.ts        // combineReducers (auth, orders, stock)
│   ├── hooks.ts              // Typed hooks (useAppDispatch, useAppSelector)
│   └── slices/
│       ├── authSlice.ts      // Staff credentials, active station & session
│       ├── orderSlice.ts     // Live orders, status transitions, rush mode delay (+20m)
│       └── stockSlice.ts     // 86 item toggles with broadcast sync
│
├── services/                 // Global API layer
│   ├── api.ts                // Base fetch wrapper with Bearer token headers
│   └── endpoints/            // Domain-specific endpoints
│       ├── authApi.ts        // Staff auth endpoints
│       └── usersApi.ts       // Staff management endpoints
│
├── hooks/                    // Global reusable hooks
│   ├── useDebounce.ts        // Input debounce hook
│   └── useAuth.ts            // Global authentication & role permission checker
│
├── lib/                      // Pure utilities & domain logic
│   ├── utils.ts              // cn, formatCurrency, formatTime, getTicketUrgency
│   └── constants.ts          // INITIAL_STAFF_USERS, INITIAL_ORDERS, INITIAL_DISHES
│
├── types/                    // Strict TypeScript definitions
│   ├── api.types.ts          // ApiResponse, PaginatedResponse, ApiError
│   └── common.types.ts       // StaffUser, KdsOrder, CartItem, StationType, OrderStatus
│
├── config/
│   └── env.ts                // Zod runtime validated environment variables
│
├── constants/
│   └── routes.ts             // Centralized ROUTES map
│
├── assets/                   // Static SVGs, thermal print icons & media
└── styles/
    └── index.css             // Tailwind base, components, utilities & custom scrollbars
```

---

## 🚀 How to Push to a Separate Git Repository

To keep the staff console completely isolated from the customer-facing website:

```bash
# 1. Open terminal in the staff-dashboard directory
cd "c:\Users\Bhaijaan\Desktop\RESTAURENT WEBSITE\staff-dashboard"

# 2. Initialize a fresh Git repository
git init

# 3. Stage all files
git add .

# 4. Create the initial commit
git commit -m "feat: initial commit for Amber Spice Staff KDS portal"

# 5. Set main branch
git branch -M main

# 6. Add your new remote repository URL (from GitHub / GitLab)
git remote add origin https://github.com/<YOUR_ORGANIZATION>/amber-spice-kds.git

# 7. Push to the remote repository
git push -u origin main
```

---

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Start development server on port 3001
npm run dev
```

The portal runs on `http://localhost:3001`.

---

## 🔒 Security & Domain Separation

- **Customer Website:** `https://amberspice.ie` (Next.js 16 app with customer order flow, reservations, and customer account dashboard).
- **Kitchen / Staff Portal:** `https://kds.amberspice.ie` (Dedicated React + Vite KDS app running in full-screen kitchen displays and chef tablets with zero public navigation or marketing footers).
