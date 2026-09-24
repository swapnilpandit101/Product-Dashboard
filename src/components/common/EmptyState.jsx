import { PackageSearch } from 'lucide-react';
import './EmptyState.css';

/**
 * ARCHITECTURAL DECISION: Reusable Empty State Component
 * 
 * WHY THIS COMPONENT EXISTS:
 * Displays a clean, user-friendly fallback state when searches, filters, or listings
 * return zero items, offering an optional quick action (e.g., "Clear Filters" or "Add Product").
 */
export function EmptyState({
  title = 'No items found',
  message = 'Try adjusting your search or filter parameters to find what you are looking for.',
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-badge">
        <PackageSearch size={28} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="empty-state-action-btn"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
