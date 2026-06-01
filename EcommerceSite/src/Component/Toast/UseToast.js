import { useState, useCallback } from "react";

let toastId = 0;
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = "success", title, message, icon, duration = 3200 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message, icon, duration }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration + 400);
  }, []);

  return { toasts, showToast, removeToast: (id) => setToasts(p => p.filter(t => t.id !== id)) };
};