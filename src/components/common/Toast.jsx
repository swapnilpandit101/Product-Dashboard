import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} className="toast-icon toast-icon-success" />;
      case 'error':
        return <AlertCircle size={20} className="toast-icon toast-icon-error" />;
      case 'warning':
        return <AlertTriangle size={20} className="toast-icon toast-icon-warning" />;
      default:
        return <Info size={20} className="toast-icon toast-icon-info" />;
    }
  };

  return (
    <div className={`toast-item toast-item-${toast.type}`} role="alert">
      <div className="toast-icon-wrapper">{getIcon()}</div>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="toast-close-btn"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
