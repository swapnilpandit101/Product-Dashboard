import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginIllustration } from '../components/auth/LoginIllustration';
import './LoginPage.css';

/**
 * ARCHITECTURAL DECISION: Login Page (SPA Navigation)
 * 
 * WHY LOGIN USES NAVIGATE() INSTEAD OF WINDOW.LOCATION:
 * Calling `navigate('/products')` transitions client-side routing within React Router DOM,
 * keeping browser memory and application shell state intact without triggering full browser reloads.
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setError('');
      await login(credentials);
      toast.success('Signed in successfully! Welcome to SP Admin.', 'Login Successful');
      navigate('/products');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Invalid credentials. Please verify your username and password.';
      setError(message);
      toast.error(message, 'Authentication Failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-card">
        <div className="login-page-header">
          <LoginIllustration />
          <h2 className="login-page-title">Product Admin Dashboard</h2>
          <p className="login-page-subtitle">
            Sign in to manage inventory, catalog, and product metrics
          </p>
        </div>

        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}
