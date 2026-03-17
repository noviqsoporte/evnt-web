'use client';

import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
  exiting: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: ToastItem }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const isVisible = mounted && !toast.exiting;

  return (
    <div
      style={{
        backgroundColor: '#141414',
        border: '1px solid #1A1A1A',
        borderLeft: `3px solid ${toast.type === 'error' ? '#E05555' : 'var(--color-accent)'}`,
        borderRadius: '6px',
        padding: '14px 20px',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '14px',
        color: '#F5F5F3',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        pointerEvents: 'auto',
      }}
    >
      {toast.message}
    </div>
  );
}
