import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { Loading } from '../components/common/Loading';

/**
 * ARCHITECTURAL DECISION: Protected Route & AppShell Guard
 * 
 * WHY THIS GUARD WRAPS APPSHELL:
 * Unauthenticated users are redirected cleanly to /login with state preserved.
 * Authenticated users access the stable AppShell once, avoiding duplicate shell wrappers
 * across every single child page.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loading fullPage message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}
