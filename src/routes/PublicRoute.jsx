import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common/Loading';

/**
 * ARCHITECTURAL DECISION: Public Route Guard
 * 
 * WHY THIS GUARD EXISTS:
 * If an already-authenticated user navigates to /login, they are immediately redirected
 * to /products rather than seeing a redundant login form.
 */
export function PublicRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loading fullPage message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
