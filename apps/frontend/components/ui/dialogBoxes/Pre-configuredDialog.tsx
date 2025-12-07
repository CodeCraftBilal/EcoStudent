// Pre-configured dialog components for common use cases
import { Dialog, DialogProps } from './Dialog';
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-react';

export const ErrorDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => {
  return <Dialog {...props} type="error" />;
};

export const SuccessDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => {
  return <Dialog {...props} type="success" />;
};

export const InfoDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => {
  return <Dialog {...props} type="info" />;
};

export const WarningDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => {
  return <Dialog {...props} type="warning" />;
};

// Confirmation Dialog
export const ConfirmDialog: React.FC<Omit<DialogProps, 'buttons' | 'type'> & {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}> = ({
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  ...props
}) => {
  return (
    <Dialog
      {...props}
      type="warning"
      buttons={[
        {
          text: cancelText,
          onClick: onCancel,
          variant: 'outline'
        },
        {
          text: confirmText,
          onClick: onConfirm,
          variant: 'danger',
          isLoading: isConfirming
        }
      ]}
    />
  );
};