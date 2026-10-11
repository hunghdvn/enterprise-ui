import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Toast, type ToastTone } from './Toast';
import styles from './Toast.module.css';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  show: (message: string, tone?: ToastTone) => void;
}

interface ToastContextValue {
  toast: ToastApi;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({
  children,
  duration = 3000,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const ids = timers.current;
    return () => {
      ids.forEach((t) => window.clearTimeout(t));
      ids.length = 0;
    };
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone) => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((prev) => [...prev, { id, message, tone }]);
      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
      timers.current.push(timer);
    },
    [duration],
  );

  const toast = useMemo<ToastApi>(
    () => ({
      success: (message: string) => push(message, 'success'),
      error: (message: string) => push(message, 'error'),
      show: (message: string, tone: ToastTone = 'info') => push(message, tone),
    }),
    [push],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      <div className={styles.region} aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} tone={t.tone} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used within ToastProvider');
  return value;
}
