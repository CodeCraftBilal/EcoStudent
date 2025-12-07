import React, { createContext, useContext, useState } from 'react';
import { Snackbar, SnackbarType } from './Snackbar';

interface SnackbarItem {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const showSnackbar = (message: string, type: SnackbarType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setSnackbars(prev => [...prev, { id, message, type, duration }]);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  };

  const contextValue: SnackbarContextType = {
    showSnackbar,
    showSuccess: (message, duration) => showSnackbar(message, 'success', duration),
    showError: (message, duration) => showSnackbar(message, 'error', duration),
    showWarning: (message, duration) => showSnackbar(message, 'warning', duration),
    showInfo: (message, duration) => showSnackbar(message, 'info', duration),
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        {snackbars.map((snackbar, index) => (
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            type={snackbar.type}
            duration={snackbar.duration}
            onClose={() => removeSnackbar(snackbar.id)}
            action={snackbar.action}
            position={index < 3 ? 'bottom-right' : 'bottom-left'}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};