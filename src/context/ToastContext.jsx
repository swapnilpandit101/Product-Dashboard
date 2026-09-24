import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/common/Toast';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = ++toastIdCounter;
    const newToast = { id, message, type, title, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    show: addToast,
    success: (message, title = 'Success', duration = 4000) =>
      addToast(message, 'success', title, duration),
    error: (message, title = 'Error', duration = 5000) =>
      addToast(message, 'error', title, duration),
    warning: (message, title = 'Warning', duration = 4500) =>
      addToast(message, 'warning', title, duration),
    info: (message, title = 'Info', duration = 4000) =>
      addToast(message, 'info', title, duration),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
