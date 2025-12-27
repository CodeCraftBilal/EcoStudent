// components/chat/OrderSidebar/OrderPriceSection.tsx
import { DollarSign } from "lucide-react";
import { useState } from "react";

interface OrderPriceSectionProps {
  agreedPrice: number;
  originalPrice?: number;
  isOwner: boolean;
  isEditing: boolean;
  onUpdate: (updates: any) => Promise<void>;
}

export default function OrderPriceSection({
  agreedPrice,
  originalPrice,
  isOwner,
  isEditing,
  onUpdate
}: OrderPriceSectionProps) {
  const [price, setPrice] = useState(agreedPrice);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate({ agreedPrice: price });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
      <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4" />
        Agreed Price
      </h4>
      
      {isEditing && isOwner ? (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-3 border border-eco-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500"
              min="0"
              max="5000"
              step="0.01"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Price"}
          </button>
          <p className="text-xs text-gray-500 text-center">Maximum: $5000</p>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">${agreedPrice ? agreedPrice.toFixed(2) : "0.00"}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              Original: ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}