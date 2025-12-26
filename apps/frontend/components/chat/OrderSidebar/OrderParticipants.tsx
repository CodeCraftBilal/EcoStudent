// components/chat/OrderSidebar/OrderParticipants.tsx
import { User, Shield } from "lucide-react";

interface OrderParticipantsProps {
  buyer?: {
    id: number;
    name?: string;
  };
  seller?: {
    id: number;
    name?: string;
  };
  currentUserId: number;
}

export default function OrderParticipants({ buyer, seller, currentUserId }: OrderParticipantsProps) {
  const isSeller = currentUserId === seller?.id;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
      <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
        <User className="w-4 h-4" />
        Participants
      </h4>
      <div className="space-y-3">
        {/* Seller */}
        <div className="flex items-center gap-3 p-3 bg-white border border-eco-200 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-eco-500 to-eco-blue-500 flex items-center justify-center text-white font-medium">
            {seller?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{seller?.name || 'Seller'}</p>
            <p className="text-sm text-gray-500">Owner</p>
          </div>
          <Shield className="w-4 h-4 text-eco-500" />
        </div>
        
        {/* Buyer */}
        <div className="flex items-center gap-3 p-3 bg-white border border-eco-200 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-eco-100 text-eco-600 flex items-center justify-center font-medium">
            {buyer?.name?.charAt(0) || 'B'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{buyer?.name || 'Buyer'}</p>
            <p className="text-sm text-gray-500">Buyer</p>
          </div>
        </div>
      </div>
    </div>
  );
}