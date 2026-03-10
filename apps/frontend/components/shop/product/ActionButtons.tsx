'use client'
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  exchangeType: string;
  price: number;
  onAddToCart: (quantity: number) => void;
  onMessageSeller: () => void;
}

export default function ActionButtons({
  exchangeType,
  price,
  onAddToCart,
  onMessageSeller
}: ActionButtonsProps) {
  const [quantity, setQuantity] = useState(1);

  const getButtonText = () => {
    switch (exchangeType) {
      case "exchange": return "Request Exchange";
      case "donation": return "Get for Free";
      default: return "Add to Cart";
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{getButtonText()}</span>
        </button>
        <button
          onClick={onMessageSeller}
          className="flex-1 border-2 border-green-500 text-green-600 hover:bg-green-50 py-4 px-6 rounded-2xl font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Message Seller</span>
        </button>
      </div>
      
      {exchangeType === "sale" && (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-gray-700">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}