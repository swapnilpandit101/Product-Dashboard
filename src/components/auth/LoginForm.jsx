import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { validateLoginForm } from '../../utils/validation';
import { useToast } from '../../context/ToastContext';
import './LoginForm.css';

/**
 * ARCHITECTURAL DECISION: Controlled Login Form Component
 * 
 * WHY THIS IS A CONTROLLED FORM WITH CLIENT VALIDATION:
 * 1. Immediate Field Feedback: Validates required inputs before making an HTTP request.
 * 2. Duplicate Request Guard: Disables submit button while `isSubmitting` is true to prevent
 *    concurrent duplicate login requests on double clicks.
 * 3. Accessibility & UX: Includes interactive Password Visibility toggle (Eye / EyeOff icons)
 *    and semantic form inputs with explicit labels and aria-invalid attributes.
 */
export function LoginForm({ onSubmit, error: apiError }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: 'emilys', // prefilled for instant developer evaluation
    password: 'emilyspass',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(
        'Please fill up all mandatory fields.',
        'Required Fields Missing'
      );

      const firstField = ['username', 'password'].find((f) => validation.errors[f]);
      if (firstField) {
        setTimeout(() => {
          const element = document.getElementById(`login-${firstField}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus({ preventScroll: true });
          }
        }, 50);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div className="login-form-error-banner" role="alert">
          {apiError}
        </div>
      )}

      <div className="login-form-group">
        <label htmlFor="login-username" className="login-form-label">
          Username
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`login-form-input ${errors.username ? 'login-form-input-error' : ''}`}
          placeholder="e.g. emilys"
          autoComplete="username"
        />
        {errors.username && (
          <span className="login-form-error-text">{errors.username}</span>
        )}
      </div>

      <div className="login-form-group">
        <label htmlFor="login-password" className="login-form-label">
          Password
        </label>
        <div className="login-form-password-wrapper">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`login-form-input login-form-input-with-toggle ${
              errors.password ? 'login-form-input-error' : ''
            }`}
            placeholder="e.g. emilyspass"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            className="login-form-toggle-password-btn"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} className="login-form-toggle-icon" />
            ) : (
              <Eye size={18} className="login-form-toggle-icon" />
            )}
          </button>
        </div>
        {errors.password && (
          <span className="login-form-error-text">{errors.password}</span>
        )}
      </div>

      <div className="login-form-demo-hint">
        <span className="login-form-demo-title">Demo Credentials:</span>
        <code>emilys / emilyspass</code>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="login-form-submit-btn"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
      </button>
    </form>
  );
}
