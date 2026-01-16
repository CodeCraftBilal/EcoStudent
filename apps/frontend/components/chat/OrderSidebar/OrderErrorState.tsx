// components/chat/OrderSidebar/OrderErrorState.tsx
import { AlertCircle } from "lucide-react";

interface OrderErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function OrderErrorState({ error, onRetry }: OrderErrorStateProps) {
  return (
    <div className="w-80 lg:w-96 border-l border-gray-200 bg-white p-6">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertCircle className="w-12 h-12 text-eco-coral mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Order</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}