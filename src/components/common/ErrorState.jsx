import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

/**
 * ARCHITECTURAL DECISION: Reusable Error State Component
 * 
 * WHY THIS COMPONENT EXISTS:
 * Provides a uniform, accessible error display across all views when an API request fails,
 * giving the user actionable feedback and an explicit Retry mechanism without refreshing the browser.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-badge">
        <AlertTriangle size={24} />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="error-state-retry-btn"
        >
          <RefreshCw size={14} className="error-state-retry-icon" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
