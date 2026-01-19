import React, { useEffect } from 'react';

export default function Toast({
  message,
  type = 'success', // 'success', 'error', 'info', 'warning'
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  const bgColor = {
    success: 'bg-green-100 border-green-400',
    error: 'bg-red-100 border-red-400',
    info: 'bg-blue-100 border-blue-400',
    warning: 'bg-yellow-100 border-yellow-400',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} border-l-4 ${textColor} px-4 py-3 rounded shadow-lg z-40 max-w-sm`}
    >
      <div className="flex items-center">
        <span className="inline-block mr-3 text-lg font-bold">{icon}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-auto font-bold opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
