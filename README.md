# Product Admin Dashboard — Senior React.js SPA

A production-quality Product Admin Dashboard Single Page Application (SPA) built from scratch with **React.js**, **Vite**, **React Router DOM**, **Axios**, and the **DummyJSON API**.

---

## 1. Overview & Key Capabilities

This application is designed and implemented following Senior React.js architectural standards. It provides a full-featured product inventory management interface with responsive desktop/tablet/mobile layouts, fixed navigation shells, robust URL state synchronization, debounced live search with request cancellation, top-center toast notifications, form validation with automatic smooth-scroll, and client-side CRUD capabilities.

### Highlights
- **100% JavaScript / JSX**: Clean, standard React with zero TypeScript files.
- **Pure Client-Side SPA**: Zero full-browser reloads across routing, filtering, search, pagination, or CRUD operations.
- **Fixed & Stable AppShell**: Desktop fixed sidebar (`250px`) and fixed navbar (`64px`) remain permanently mounted while route content scrolls independently.
- **Direct Browser API Traffic**: Every request directly queries `https://dummyjson.com` (visible in DevTools Network Fetch/XHR tab). 100% of network calls use the centralized Axios client with **zero raw `fetch()` calls**.
- **Top-Center Toast Alert System**: Centralized reactive toast notifications (`useToast`) in solid high-contrast Red and Green themes.
- **Mandatory Form Validation & Smooth Scroll**: Submitting incomplete forms triggers top-center toast alerts, highlights invalid fields in red, and smoothly scrolls to the topmost unfilled field.
- **Responsive View Switching**: Efficient Product Table on desktop viewports; clean Product Cards on mobile screens with icon-based actions.
- **Race Condition Prevention**: Keystroke debouncing (400ms) combined with active `AbortController` cancellation prevents out-of-order search responses.
- **Safe URL Normalization**: URL query parameters (`page`, `pageSize`, `search`, `category`, `sort`) are strictly clamped and sanitized to prevent edge-case crashes.
- **Vercel SPA Ready**: Native `vercel.json` rewrites for seamless client-side page reloads.

---

## 2. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework / Bundler** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `useSearchParams`, `useNavigate`) |
| **State & Context** | React Context API (`AuthContext`, `ToastContext`) |
| **HTTP Client** | Centralized Axios Client (`src/lib/axios.js`) — 100% Axios, 0 `fetch()` |
| **API** | DummyJSON Public REST API (`https://dummyjson.com`) |
| **Icon Library** | Lucide React (`lucide-react`) SVG Icons |
| **Styling** | 100% Dedicated Component-Scoped CSS Files with Solid, High-Contrast Design System |

---

## 3. Project Architecture & Folder Structure

```
product-admin-dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── LoginForm.css
│   │   │   ├── LoginIllustration.jsx
│   │   │   └── LoginIllustration.css
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── AppShell.css
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Toast.jsx
│   │   │   ├── Toast.css
│   │   │   ├── Loading.jsx
│   │   │   ├── Loading.css
│   │   │   ├── ErrorState.jsx
│   │   │   ├── ErrorState.css
│   │   │   ├── EmptyState.jsx
│   │   │   ├── EmptyState.css
│   │   │   ├── Pagination.jsx
│   │   │   ├── Pagination.css
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── ConfirmModal.css
│   │   └── products/
│   │       ├── ProductTable.jsx
│   │       ├── ProductTable.css
│   │       ├── ProductCard.jsx
│   │       ├── ProductCard.css
│   │       ├── ProductFilters.jsx
│   │       ├── ProductFilters.css
│   │       ├── ProductForm.jsx
│   │       ├── ProductForm.css
│   │       ├── ProductDetails.jsx
│   │       └── ProductDetails.css
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   ├── ProductsPage.jsx
│   │   ├── ProductsPage.css
│   │   ├── ProductDetailsPage.jsx
│   │   ├── ProductDetailsPage.css
│   │   ├── CreateProductPage.jsx
│   │   ├── CreateProductPage.css
│   │   ├── EditProductPage.jsx
│   │   └── EditProductPage.css
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── product.service.js
│   │
│   ├── lib/
│   │   └── axios.js
│   │
│   ├── hooks/
│   │   └── useDebounce.js
│   │
│   ├── utils/
│   │   ├── pagination.js
│   │   └── validation.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── vercel.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18+ and npm installed.

### Installation & Launch
```bash
# 1. Clone repository & navigate to folder
cd product-admin-dashboard

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start Vite development server
npm run dev
```

### Production Build & Linting
```bash
# Production bundle build
npm run build

# Code lint verification
npm run lint
```

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://dummyjson.com
```

> **Note:** Because this is a Vite-based application, all client-exposed environment variables must start with the `VITE_` prefix (e.g. `VITE_API_URL`).

---

## 6. Authentication & Session Flow

### Demo Credentials
- **Username:** `emilys`
- **Password:** `emilyspass`

### Authentication Architecture
1. **Login API:** `POST https://dummyjson.com/auth/login`.
2. **Duplicate Request Guard:** `LoginForm.jsx` locks inputs and disables submit button during active `isSubmitting` state.
3. **Session Persistence:** Upon successful authentication, `accessToken` and user profile are saved in `localStorage` (`auth_token` and `auth_user`).
4. **Route Guards:**
   - `ProtectedRoute.jsx`: Unauthenticated visitors to `/products`, `/products/new`, `/products/:id`, or `/products/:id/edit` are redirected to `/login`.
   - `PublicRoute.jsx`: Authenticated visitors accessing `/login` are automatically redirected to `/products`.
5. **401 Response Handling:** The response interceptor in `src/lib/axios.js` detects `401 Unauthorized`, purges invalid tokens, and dispatches an `'app:unauthorized'` event for `AuthContext` to redirect cleanly to `/login` without invoking `window.location.reload()`.

---

## 7. DummyJSON API Mapping (100% Axios Transport)

All network calls are encapsulated within the service layer (`src/services/*`):

| Operation | HTTP Method | Endpoint | Service Method |
| :--- | :--- | :--- | :--- |
| **User Login** | `POST` | `/auth/login` | `authService.login()` |
| **Fetch Products** | `GET` | `/products?limit={limit}&skip={skip}&sortBy={sortBy}&order={order}` | `productService.getProducts()` |
| **Search Products** | `GET` | `/products/search?q={query}&limit={limit}&skip={skip}` | `productService.searchProducts()` |
| **Fetch Categories** | `GET` | `/products/categories` | `productService.getCategories()` |
| **Products by Category** | `GET` | `/products/category/{category}?limit={limit}&skip={skip}` | `productService.getProductsByCategory()` |
| **Product Details** | `GET` | `/products/{id}` | `productService.getProductById()` |
| **Add Product** | `POST` | `/products/add` | `productService.addProduct()` |
| **Update Product** | `PUT` | `/products/{id}` | `productService.updateProduct()` |
| **Delete Product** | `DELETE` | `/products/{id}` | `productService.deleteProduct()` |

---

## 8. Technical Deep-Dives & Key Feature Implementations

### A. Top-Center Toast Notification System (`useToast`)
- **Global Toast Manager:** Built into `src/context/ToastContext.jsx` and rendered via `ToastContainer` at top-center (`z-index: 99999`).
- **Solid Flat 2-Color Architecture:**
  - **Red (`#dc2626`):** For validation errors, missing mandatory fields, and API errors.
  - **Green (`#16a34a`):** For successful operations (product creation, updates, deletions, and login).
- **Auto-Dismissal & Manual Close:** Notifications auto-dismiss after 4-5 seconds and include an accessible manual close button.

### B. Mandatory Form Validation & Smooth Auto-Scroll
- When creating or editing products, all mandatory fields (`title`, `description`, `category`, `price`, `stock`) are validated on submission.
- **Top Toast Trigger:** Triggers an immediate `"Please fill up all mandatory fields."` alert.
- **Visual Highlight:** Missing inputs are highlighted with solid red borders (`#ef4444`) and subtle pulse animation.
- **Auto-Scroll:** Automatically scrolls the window smoothly to the topmost unfilled field (`scrollIntoView({ behavior: 'smooth', block: 'center' })`) and applies focus.

### C. Icon-Only Action Buttons System
- Replaced word labels with intuitive, accessible icons:
  - 👁️ **View Details:** White Eye icon on dark background.
  - ✏️ **Edit Product:** Blue Pen icon with high-contrast active feedback.
  - 🗑️ **Delete Product:** Red Trash icon with confirmation dialog integration.
- Standardized across Product Cards (mobile), Product Table (desktop), and Product Details Page.

### D. Debounced Live Search with AbortController Cancellation
1. **Debounce (400ms):** `useDebounce` delays updating search parameters until the user pauses typing.
2. **AbortController:** Every search request creates a new `AbortController`. The previous in-flight controller is aborted before issuing the new request.
3. **Cancellation Handling:** `axios.isCancel(err)` and `err.name === 'CanceledError'` are caught and suppressed so user feedback is not interrupted by canceled promises.

### E. Search & Category Filter Conflict Reconciliation
- Selecting a **Category** resets active search queries and navigates to page 1.
- Typing in **Search** clears category filters and navigates to page 1.

### F. URL State Synchronization & Safe Parameter Normalization
- All state parameters (`page`, `pageSize`, `search`, `category`, `sort`) are kept in sync with URL search params.
- Clamping prevents crashes on negative or out-of-range page numbers.

### G. Responsive Symmetric Pagination
- **Desktop:** Full numbered page list with Prev/Next buttons and page size selector.
- **Mobile / Tablet:** Symmetric layout with clear item count, centered page size selector, and a balanced bottom action bar (`[Prev] Page X of Y [Next]`).

### H. Mobile Header & Hamburger Menu
- Hamburger menu button styled with high-contrast solid white background and pure black icon.
- Mobile Top Header features the **SP Admin** brand logo (`/favicon.svg`) with fixed dimensions preventing layout squishing.
- Logout button collapses to a compact icon button on mobile/tablet screens to eliminate horizontal overflow.

---

## 9. Design System & CSS Architecture

- **Solid, Non-Glassy Color Palette:** Replaced transparent/glassy backgrounds with solid, high-contrast badges (e.g. solid red discount tags and solid stock status badges).
- **Zero Inline Styles (`style={{ ... }}`):** 100% of styling is organized in dedicated component CSS files.
- **Component-Prefixed Class Names:** Every class is namespace-prefixed (e.g. `.sidebar-*`, `.product-table-*`, `.product-card-*`, `.product-filters-*`, `.toast-*`).
- **Responsive Layout Testing:**
  - **Desktop (1440px / 1024px):** Fixed sidebar, top navbar, product table, multi-column filter bar.
  - **Tablet (768px):** Collapsible drawer navigation, stacked filter reflow.
  - **Mobile (375px / 320px):** Full-width card layout replacing table, compact pagination, full touch-target forms, zero horizontal page overflow.

---

## 10. Deployment

This application includes a native `vercel.json` rewrite configuration for seamless zero-config deployment on **Vercel** or **Netlify**:

```bash
# Build command
npm run build

# Output directory
dist/
```

Set the environment variable in your deployment platform settings:
- `VITE_API_URL=https://dummyjson.com`

---

## 11. License

MIT License — Developed as a production-grade React.js Single Page Application.
