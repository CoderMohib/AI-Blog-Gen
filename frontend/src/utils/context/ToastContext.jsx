import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0; // simple incremental ID

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

// src/context/ToastContext.jsx
const showToast = useCallback((message, type = "info", onAction) => {
  const id = toastId++;
  setToasts(prev => [...prev, { id, message, type, onAction }]);
}, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Remove corner container; Toast now handles its own overlay */}
      {toasts.map(t => (
        <Toast
          key={t.id}
          id={t.id}
          message={t.message}
          type={t.type}
          onClose={removeToast}
          onAction={t.onAction}
        />
      ))}
    </ToastContext.Provider>
  );
};
