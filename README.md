# Product Admin Dashboard — Senior React.js SPA

A production-quality Product Admin Dashboard Single Page Application (SPA) built from scratch with **React.js**, **Vite**, **React Router DOM**, **Axios**, and the **DummyJSON API**.

---

## 1. Overview & Key Capabilities

This application is designed and implemented following Senior React.js architectural standards. It provides a full-featured product inventory management interface with responsive desktop/tablet/mobile layouts, fixed navigation shells, robust URL state synchronization, debounced live search with request cancellation, and client-side CRUD capabilities.

### Highlights
- **100% JavaScript / JSX**: Clean, standard React with zero TypeScript files.
- **Pure Client-Side SPA**: Zero full-browser reloads across routing, filtering, search, pagination, or CRUD operations.
- **Fixed & Stable AppShell**: Desktop fixed sidebar (`250px`) and fixed navbar (`64px`) remain permanently mounted while route content scrolls independently.
- **Direct Browser API Traffic**: Every request directly queries `https://dummyjson.com` (visible in DevTools Network Fetch/XHR tab). 100% of network calls use the centralized Axios client with **zero raw `fetch()` calls**.
- **Responsive View Switching**: Efficient Product Table on desktop viewports; clean Product Cards on mobile screens.
- **Race Condition Prevention**: Keystroke debouncing (400ms) combined with active `AbortController` cancellation prevents out-of-order search responses.
- **Safe URL Normalization**: URL query parameters (`page`, `pageSize`, `search`, `category`, `sort`) are strictly clamped and sanitized to prevent edge-case crashes.

---

## 2. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework / Bundler** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `useSearchParams`, `useNavigate`) |
| **HTTP Client** | Centralized Axios Client (`src/lib/axios.js`) — 100% Axios, 0 `fetch()` |
| **API** | DummyJSON Public REST API (`https://dummyjson.com`) |
| **Icon Library** | Lucide React (`lucide-react`) SVG Icons |
| **Styling** | 100% Dedicated Component-Scoped CSS Files (Zero `:hover`, Zero `box-shadow`, Zero gradients) |

---

## 3. Project Architecture & Folder Structure

```
product-admin-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── LoginForm.css
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── AppShell.css
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
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
│   │   └── AuthContext.jsx
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

## 8. Technical Deep-Dives & Senior Implementation Patterns

### A. Debounced Live Search with AbortController Cancellation
When users type quickly (e.g. `phone` -> `phones` -> `iphone`), multiple network requests are queued. Due to asynchronous network latency variation, a slower response from an earlier query could resolve after a newer query, causing stale results to overwrite fresh data.

**Solution:**
1. **Debounce (400ms):** `useDebounce` delays updating search parameters until the user pauses typing.
2. **AbortController:** Every search request creates a new `AbortController`. The previous in-flight controller is aborted before issuing the new request.
3. **Cancellation Handling:** `axios.isCancel(err)` and `err.name === 'CanceledError'` are caught and suppressed so user feedback is not interrupted by canceled promises.
4. **Latency Verification:** Can be tested against slow networks or simulated by adding `&delay=2000` to the API request.

### B. Search & Category Filter Conflict Reconciliation
**DummyJSON Limitation:** The DummyJSON backend API does not support combining search queries with category slugs (e.g. `/products/search?q=phone&category=smartphones` is unsupported).

**Reconciliation Policy:**
- When the user selects a **Category**, any existing **Search** query is cleared and page resets to `1`.
- When the user types a **Search** query, any selected **Category** filter is cleared and page resets to `1`.

### C. Sorting Support (Price, Rating, Title)
- Dropdown selector in `ProductFilters.jsx` provides:
  - `Price: Low to High` (`price-asc`)
  - `Price: High to Low` (`price-desc`)
  - `Rating: High to Low` (`rating-desc`)
  - `Rating: Low to High` (`rating-asc`)
  - `Title: A to Z` (`title-asc`)
  - `Title: Z to A` (`title-desc`)
- Parsed in `ProductsPage.jsx` into `sortBy` and `order` and passed to DummyJSON API.
- Stored directly in the URL query string: `?sort=price-asc`.

### D. URL State Synchronization & Safe Parameter Normalization
All application state (`page`, `pageSize`, `search`, `category`, `sort`) is bidirectionally synchronized with React Router's `useSearchParams()`.
- **Clamping:** Invalid parameters (e.g. `page=-5`, `page=abc`, or `page=99999`) are safely normalized and clamped to `[1, totalPages]`.
- **Sharing & History:** Users can bookmark, reload, share URLs, or use browser Back/Forward navigation with 100% state fidelity.

### E. Reusable Pagination Component & Math
- Written from scratch with **zero third-party pagination libraries** in `src/utils/pagination.js`.
- **UI Elements:**
  - **Numbered Page Buttons:** `1 2 3 4 5` with active state highlighting.
  - **Previous & Next Buttons:** With `<ChevronLeft />` and `<ChevronRight />` icons.
  - **Page Size Selector:** Options for `10`, `20`, and `50` items per page.
  - **Summary Display Text:** Exact formatted string: `"Showing 1 to 10 of 194 products"`.

### F. Simulated DummyJSON Mutation Handling
DummyJSON simulates database mutations (`POST /products/add`, `PUT /products/:id`, `DELETE /products/:id`) and returns mock response objects without permanently persisting them to disk.
- To provide a realistic SPA experience, successful mutations update the local React state during the active user session.
- Deleting an item removes it from local state, adjusts total count, and recalibrates pagination.

### G. Duplicate Request & Interaction Guards
To prevent duplicate API submissions from rapid clicking:
- **Login:** `LoginForm.jsx` tracks `isSubmitting` and disables the submit button.
- **Create / Edit:** `ProductForm.jsx` tracks `isSubmitting` and locks all controls.
- **Delete Modal:** `ConfirmModal.jsx` tracks `isDeleting` and disables action triggers.

### H. Reusable UI Primitives
- **`Loading.jsx`**: Exactly ONE global loading spinner used across login, catalog, details, forms, and deletion.
- **`ErrorState.jsx`**: Uniform error card featuring error explanations and an interactive **"Try Again" (Retry)** button.
- **`EmptyState.jsx`**: Clean zero-result display with a **"Clear All Filters"** action button.
- **`ConfirmModal.jsx`**: Sticky header/footer dialog with scrollable content. **Outside overlay clicks are deliberately disabled** to prevent accidental dismissal during critical actions.
- **`Pagination.jsx`**: Full numbered desktop bar switching to a compact mobile indicator.

---

## 9. Strict CSS Design System & Compliance

This application adheres to strict frontend styling standards:
- **Zero `:hover`:** Replaced by active states (`.sidebar-item-active`, `:active`, `.pagination-btn-active`), focus rings, and curated contrast palettes.
- **Zero `box-shadow`:** Clean solid border lines (`1px solid var(--border-color)`).
- **Zero Gradients:** Solid, readable HSL/Hex color values with high contrast.
- **Zero Inline Styles (`style={{ ... }}`):** 100% of styles reside in dedicated `.css` files.
- **Component-Prefixed Class Names:** Every class is namespace-prefixed (e.g. `.sidebar-*`, `.product-table-*`, `.product-card-*`, `.product-filters-*`).
- **No Container Dimension Locks:** Major application containers do not use `min-width`, `max-width`, `min-height`, or `max-height`.

### Responsive Breakpoints Tested
- **Desktop (1440px / 1024px):** Fixed sidebar, top navbar, product table, multi-column filter bar.
- **Tablet (768px):** Collapsible drawer navigation, stacked filter reflow.
- **Mobile (375px):** Full-width card layout replacing table, compact pagination, full touch-target forms, zero horizontal page overflow.

---

## 10. Senior React Performance Considerations

- **Pragmatic Memoization:** `useMemo` is used for derived pagination math (`skip`, `totalPages`, `visiblePages`) and sort mapping; `useCallback` stabilizes action handlers passed to child views.
- **Derived State Over Duplicate State:** Derived quantities (like range indices and pagination totals) are computed during render rather than mirrored in parallel state variables.
- **Zero Artificial Remounts:** No `key={Date.now()}` or arbitrary key resets. AppShell remains permanently mounted across route changes.

---

## 11. Solved Technical Case Study: Search Race Conditions

**Problem:**  
In live-search interfaces, typing "apple" generates sequential requests for "a", "ap", "app", "appl", "apple". Because network round-trip times vary, the response for "app" (e.g. 800ms latency) may resolve after "apple" (e.g. 200ms latency), resulting in the UI showing results for "app" despite the search box showing "apple".

**Solution Architecture:**  
We combined:
1. `useDebounce(searchQuery, 400)` to delay emission until user input stabilizes.
2. `AbortController` bound to `useEffect`. When the debounced query updates, `abortControllerRef.current.abort()` cancels the preceding HTTP request at the browser network layer before initiating the new request.
3. Catch block filters out `CanceledError` silently, guaranteeing that only the latest initiated search updates component state.

---

## 12. AI Usage Disclosure

In compliance with transparent engineering practices, AI assistance was utilized during this project for:
- DummyJSON API endpoint capability and constraint research (documenting search vs category backend limitation).
- Architectural validation for Vite React Router SPA patterns.
- Edge-case scenario identification (URL query parameter clamping, form constraints).
- Assistance with documentation structure and formatting.

*All final architecture, code, CSS systems, component structures, and verification audits were reviewed, tested, understood, and manually verified.*

---

## 13. Deployment

This application is ready for zero-config deployment on **Vercel** or **Netlify**:

```bash
# Build output directory
dist/

# Build command
npm run build
```

Set the environment variable in your deployment platform:
- `VITE_API_URL=https://dummyjson.com`

---

## 14. License

MIT License — Developed as a production-grade React.js Single Page Application.
