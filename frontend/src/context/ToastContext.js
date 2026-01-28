import React, { createContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'success', duration = 3000) => {
      const id = Date.now();
      const toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      if (duration) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );

  const showError = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration) => addToast(message, 'warning', duration),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const getStyles = () => {
    const baseClasses = `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-500 border border-white/10 ${isExiting ? 'toast-exit' : 'toast-enter'
      }`;

    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-white text-black shadow-white/5`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-orange-500 text-white`;
      case 'info':
        return `${baseClasses} bg-[#111] text-white`;
      default:
        return `${baseClasses} bg-[#111] text-white`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle size={20} className="flex-shrink-0" />;
      case 'error':
        return <FiAlertCircle size={20} className="flex-shrink-0" />;
      case 'warning':
        return <FiAlertCircle size={20} className="flex-shrink-0" />;
      case 'info':
        return <FiInfo size={20} className="flex-shrink-0" />;
      default:
        return <FiCheckCircle size={20} className="flex-shrink-0" />;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-center gap-3 flex-1">
        {getIcon()}
        <p className="font-semibold text-sm">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        title="Close"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

// Custom Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
