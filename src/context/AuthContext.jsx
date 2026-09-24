/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

/**
 * ARCHITECTURAL DECISION: React Authentication Context
 * 
 * WHY THIS CONTEXT EXISTS:
 * 1. Global Session State: Provides authentication status (user, token, isAuthenticated)
 *    to all routes, navigation guards, and components without prop drilling.
 * 2. Client-Side Persistence: Initializes state from localStorage on page load, ensuring
 *    sessions persist across page refreshes.
 * 3. Event-Driven 401 Synchronization: Listens to the 'app:unauthorized' custom DOM event
 *    dispatched by Axios response interceptor, enabling seamless automatic logout without
 *    window.location.reload() or tight coupling between Axios and React Router.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('auth_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Mark auth initialization as complete on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (err) {
      console.warn('Storage removal failed:', err);
    }
    setToken(null);
    setUser(null);
  }, []);

  // Listen to 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('app:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('app:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(async ({ username, password }) => {
    const data = await authService.login({ username, password });
    
    // Extract token (DummyJSON returns accessToken or token)
    const authToken = data.accessToken || data.token;
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
    };

    try {
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Storage persistence failed:', err);
    }

    setToken(authToken);
    setUser(userData);
    return data;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isInitialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
