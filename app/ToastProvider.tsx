"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-800/90 border-green-500/50 text-green-100";
      case "error":
        return "bg-red-800/90 border-red-500/50 text-red-100";
      case "warning":
        return "bg-yellow-800/90 border-yellow-500/50 text-yellow-100";
      case "info":
      default:
        return "bg-blue-800/90 border-blue-500/50 text-blue-100";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-lg border shadow-lg backdrop-blur-sm
              transform transition-all duration-300 ease-in-out
              animate-fadeInUp
              ${getToastStyles(toast.type)}
            `}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium pr-2">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}