import React, { ReactNode } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  TriangleAlert,
  X,
  Loader2
} from 'lucide-react';

export interface ButtonConfig {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: ReactNode;
  isLoading?: boolean;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  buttons?: ButtonConfig[];
  showCloseButton?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  buttons = [],
  showCloseButton = true,
  icon,
  children
}) => {
  if (!isOpen) return null;

  const typeConfigs = {
    error: {
      icon: icon || <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-green-coral',
      titleColor: 'text-red-900',
      textColor: 'text-red-700'
    },
    success: {
      icon: icon || <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      titleColor: 'text-green-700',
      textColor: 'text-green-600'
    },
    info: {
      icon: icon || <Info className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700'
    },
    warning: {
      icon: icon || <TriangleAlert className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-green-sun',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700'
    }
  };

  const config = typeConfigs[type];

  const getButtonClasses = (variant: ButtonConfig['variant'] = 'primary') => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
    
    switch(variant) {
      case 'primary':
        return `${base} bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow`;
      case 'secondary':
        return `${base} bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow`;
      case 'outline':
        return `${base} border border-green-500 text-green-500 hover:bg-green-50`;
      case 'danger':
        return `${base} bg-green-coral hover:bg-red-500 text-white shadow-sm hover:shadow`;
      default:
        return `${base} bg-gray-100 hover:bg-gray-200 text-gray-700`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-md rounded-2xl bg-white shadow-xl transform transition-all ${config.bgColor} border ${config.borderColor}`}>
          
          {/* Header */}
          <div className="p-6">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                {config.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${config.titleColor}`}>
                  {title}
                </h3>
                <p className={`mt-2 ${config.textColor}`}>
                  {description}
                </p>
                
                {/* Additional Content */}
                {children && (
                  <div className="mt-4">
                    {children}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer with Buttons */}
          {buttons.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="flex justify-end gap-3">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.onClick}
                    disabled={button.isLoading}
                    className={getButtonClasses(button.variant)}
                  >
                    {button.isLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {button.icon && !button.isLoading && button.icon}
                    {button.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};