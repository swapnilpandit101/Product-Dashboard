import './Loading.css';

/**
 * ARCHITECTURAL DECISION: Single Global Loading Component
 * 
 * WHY EXACTLY ONE LOADING COMPONENT EXISTS:
 * Eliminates fragmented loaders (LoginLoader, TableLoader, DeleteLoader, etc.) and ensures
 * a consistent visual loading language throughout the entire application.
 * Accepts optional message and size variants ('sm', 'md', 'lg').
 */
export function Loading({ message = 'Loading...', size = 'md', fullPage = false }) {
  const containerClass = fullPage ? 'loading-container loading-fullpage' : 'loading-container';
  const spinnerClass = `loading-spinner loading-spinner-${size}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass} role="status" aria-label={message} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
