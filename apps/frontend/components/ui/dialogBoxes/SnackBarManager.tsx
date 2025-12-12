import React, { createContext, useContext, useState } from "react";
import { Snackbar, SnackbarType, SnackbarPosition } from "./Snackbar";

interface SnackbarItem {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
  position?: SnackbarPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number,
    position?: SnackbarPosition
  ) => void;

  showSuccess: (message: string, duration?: number, position?: SnackbarPosition) => void;
  showError: (message: string, duration?: number, position?: SnackbarPosition) => void;
  showWarning: (message: string, duration?: number, position?: SnackbarPosition) => void;
  showInfo: (message: string, duration?: number, position?: SnackbarPosition) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const showSnackbar = (
    message: string,
    type: SnackbarType = "info",
    duration = 5000,
    position: SnackbarPosition = "bottom-right"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setSnackbars((prev) => [...prev, { id, message, type, duration, position }]);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  };

  const ctxValue: SnackbarContextType = {
    showSnackbar,
    showSuccess: (msg, dur, pos) => showSnackbar(msg, "success", dur, pos),
    showError: (msg, dur, pos) => showSnackbar(msg, "error", dur, pos),
    showWarning: (msg, dur, pos) => showSnackbar(msg, "warning", dur, pos),
    showInfo: (msg, dur, pos) => showSnackbar(msg, "info", dur, pos)
  };

  return (
    <SnackbarContext.Provider value={ctxValue}>
      {children}

      <div className="fixed inset-0 pointer-events-none z-50">
        {snackbars.map((snack) => (
          <Snackbar
            key={snack.id}
            message={snack.message}
            type={snack.type}
            duration={snack.duration}
            position={snack.position}
            action={snack.action}
            onClose={() => removeSnackbar(snack.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};
