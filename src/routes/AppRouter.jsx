import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CreateProductPage } from '../pages/CreateProductPage';
import { EditProductPage } from '../pages/EditProductPage';

/**
 * ARCHITECTURAL DECISION: Application Route Manifest
 * 
 * WHY CLIENT-SIDE ROUTING MANIFEST:
 * Centralizes all SPA route definitions, public route redirects, and protected AppShell hierarchies.
 * Pure SPA navigation eliminates any full browser reloads across route transitions.
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/products" replace />} />

      {/* Public Routes (e.g. Login) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated Protected Routes (wrapped in AppShell) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<CreateProductPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/products/:id/edit" element={<EditProductPage />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
