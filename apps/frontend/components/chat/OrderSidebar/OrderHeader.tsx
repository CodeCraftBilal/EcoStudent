// components/chat/OrderSidebar/OrderHeader.tsx
import { Package } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface OrderHeaderProps {
  order: any | null;
}

export default function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Package className="w-5 h-5 text-eco-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          <p className="text-sm text-gray-500">
            {order ? "Track your purchase" : "Create new order"}
          </p>
        </div>
      </div>
      
      {order && <StatusBadge status={order.status} />}
    </div>
  );
}