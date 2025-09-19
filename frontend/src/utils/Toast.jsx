// src/components/Toast.jsx
import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";

const icons = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const titles = {
  success: "Success",
  info: "Info",
  warning: "Warning",
  error: "Error",
};

export default function Toast({ id, message, type = "info", onClose, onAction }) {
  const Icon = icons[type] || Info;
  const title = titles[type] || "Notification";

  // Colors using CSS variables for theme support
  const bgColor = "var(--color-card-muted)";
  const titleColor = "var(--color-text)";
  const messageColor = "var(--color-text-secondary)";
  const iconColor = {
    success: "#22c55e",
    info: "var(--color-primary)",
    warning: "#facc15",
    error: "#ef4444",
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={() => onClose(id)}
        style={{ pointerEvents: "auto" }} 
      />

      {/* Toast card */}
      <div
        className="relative flex flex-col items-center gap-3 px-8 py-6 rounded-xl max-w-lg w-11/12 pointer-events-auto text-center"
        style={{
          backgroundColor: bgColor,
          color: titleColor,
          fontFamily: "var(--font-sans)",
        }}
      >
        <Icon color={iconColor} size={40} />
        <h3 className="text-xl font-bold" style={{ color: titleColor }}>
          {title}
        </h3>
        <p className="text-sm mt-1" style={{ color: messageColor }}>
          {message}
        </p>

        {/* OK Button always visible */}
        <button
          className="mt-3 px-6 py-2 rounded-full font-semibold bg-button-dark-hover 
            text-button-dark-text border border-button-border hover:bg-card-muted hover:text-text cursor-pointer"
          onClick={() => {
            if (onAction) onAction(); // trigger callback if provided
            onClose(id); // always close toast
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
