// components/chat/OrderSidebar/OrderActions.tsx - Updated
import { CheckCircle, XCircle, AlertCircle, Clock, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/context/useSocket";

interface OrderActionsProps {
  order: any;
  isOwner: boolean;
  isBuyer: boolean;
  canCancel: boolean;
  isUpdating: boolean;
  onAccept: () => Promise<void>;
  onCancel: () => Promise<void>;
}

export default function OrderActions({
  order,
  isOwner,
  isBuyer,
  canCancel,
  isUpdating,
  onAccept,
  onCancel
}: OrderActionsProps) {
  const {orderSocket} = useSocket();
  const isOrderSocketConnected = orderSocket?.connected;

  // Buyer actions for pending orders
  if (isBuyer && order.status === 'pending') {
    return (
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-eco-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-eco-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Accept Order</h3>
                <div className="flex items-center gap-2 text-sm">
                  {isOrderSocketConnected ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      Live
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Offline
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Review the order details and accept to proceed with the exchange.
                The seller will be notified instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onAccept}
            disabled={isUpdating || !isOrderSocketConnected}
            className="w-full px-4 py-3 bg-linear-to-r from-eco-500 to-eco-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Accept Order
              </>
            )}
          </button>
          {!isOrderSocketConnected && (
            <p className="text-xs text-eco-coral text-center mt-2">
              Connect to enable real-time updates
            </p>
          )}
        </div>
      </div>
    );
  }

  // Cancel button for accepted orders
  if ((isBuyer || isOwner) && order.status === 'accepted') {
    const showCancel = isBuyer ? canCancel : true;

    if (showCancel) {
      return (
        <div className="mb-6">
          <div className={`rounded-xl shadow-sm p-5 border ${isBuyer ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-eco-200'}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isBuyer ? 'bg-yellow-100' : 'bg-red-50'}`}>
                <AlertCircle className={`w-5 h-5 ${isBuyer ? 'text-yellow-600' : 'text-eco-coral'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isBuyer 
                    ? "You can cancel this order within the allowed cancellation window."
                    : "As the seller, you can cancel this order at any time before completion."
                  }
                  {isOrderSocketConnected && " Both parties will be notified instantly."}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isUpdating || !isOrderSocketConnected}
              className={`w-full px-4 py-3 font-medium rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isBuyer 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-linear-to-r from-eco-coral to-red-500 text-white hover:opacity-90'
              }`}
            >
              {isUpdating ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Cancel Order
                </>
              )}
            </button>
            
            {isBuyer && !canCancel && (
              <p className="text-sm text-red-600 mt-3 text-center">
                Cancellation window has expired.
              </p>
            )}
            
            {!isOrderSocketConnected && (
              <p className="text-xs text-eco-coral text-center mt-2">
                Connect to enable real-time cancellation
              </p>
            )}
          </div>
        </div>
      );
    }
  }

  return null;
}