import { useEffect } from 'react';
import { X } from 'lucide-react';
import './ConfirmModal.css';

/**
 * ARCHITECTURAL DECISION: Reusable Confirmation Modal
 * 
 * WHY OUTSIDE-CLICK IS DISABLED:
 * Accidental outside clicks during destructive operations (e.g. Delete Product)
 * can cause confusing cancellations. Requiring an explicit button click ('Cancel', 'Close',
 * or 'Confirm') guarantees deliberate user intent.
 * 
 * WHY ESCAPE KEY CLOSES:
 * Standard keyboard accessibility pattern allows users to dismiss the dialog safely.
 */
export function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary'
  isConfirming = false,
  onConfirm,
  onClose,
}) {
  // Handle ESC key dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isConfirming) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isConfirming, onClose]);

  if (!isOpen) {
    return null;
  }

  const confirmBtnClass = `confirm-modal-btn confirm-modal-btn-${confirmVariant}`;

  return (
    <div
      className="confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="confirm-modal-container">
        {/* Sticky Header */}
        <div className="confirm-modal-header">
          <h3 id="confirm-modal-title" className="confirm-modal-title">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="confirm-modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="confirm-modal-body">
          {typeof message === 'string' ? (
            <p className="confirm-modal-message">{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Sticky Footer */}
        <div className="confirm-modal-footer">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="confirm-modal-btn confirm-modal-btn-cancel"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={confirmBtnClass}
          >
            {isConfirming ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
