import axios from 'axios';

/**
 * ARCHITECTURAL DECISION: Centralized Axios Instance
 * 
 * WHY THIS MODULE EXISTS:
 * 1. Single Point of Configuration: Configures the base URL, headers, and timeouts in one place.
 * 2. Separation of Concerns: UI components and service files do not need to manually attach tokens
 *    or parse standard error envelopes.
 * 3. Browser-Direct Network Requirement: All requests execute in the client context directly to DummyJSON.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * ARCHITECTURAL DECISION: Request Interceptor for Token Injection
 * 
 * WHY TOKEN INJECTION IS IN THE INTERCEPTOR:
 * Storing the access token in localStorage and injecting it automatically per-request
 * ensures that services stay stateless and authentication credentials are systematically
 * attached to all outgoing requests without repetitive boilerplate in API service functions.
 */
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Storage access might fail in restricted iframe environments; fail gracefully
      console.warn('Unable to access localStorage for auth token:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ARCHITECTURAL DECISION: Response Interceptor & 401 Handling
 * 
 * WHY 401 HANDLING USES CUSTOM EVENTS INSTEAD OF REACT HOOKS:
 * Axios modules are standard JavaScript files outside the React component lifecycle.
 * Calling `useNavigate()` or React hooks here would violate React's Rules of Hooks.
 * Instead, on 401 Unauthorized, we clear the invalid stored credentials and dispatch a
 * custom DOM event ('app:unauthorized') which the React AuthContext listens to for a
 * clean SPA redirect to /login without full page reload.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If request was canceled by AbortController, let caller handle cancellation silently
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } catch (err) {
        console.warn('Error clearing storage on 401:', err);
      }
      
      // Notify AuthContext in React tree without hard window reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
