import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function SimpleToast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      ${getTypeStyles()}
      border rounded-lg p-4 text-white shadow-lg
      animate-fade-in-up
    `}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{getIcon()}</span>
        <span className="flex-1 text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Toast manager
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const toasts: Toast[] = [];
let setToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export const toast = {
  success: (message: string) => {
    const id = `toast-${++toastId}`;
    toasts.push({ id, message, type: 'success' });
    setToasts?.([...toasts]);
  },
  error: (message: string) => {
    const id = `toast-${++toastId}`;
    toasts.push({ id, message, type: 'error' });
    setToasts?.([...toasts]);
  },
  info: (message: string) => {
    const id = `toast-${++toastId}`;
    toasts.push({ id, message, type: 'info' });
    setToasts?.([...toasts]);
  }
};

export function ToastContainer() {
  const [toastList, setToastList] = useState<Toast[]>([]);
  
  useEffect(() => {
    setToasts = setToastList;
  }, []);

  const removeToast = (id: string) => {
    setToastList(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map(toast => (
        <SimpleToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
