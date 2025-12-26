// components/chat/OrderSidebar/OrderProductInfo.tsx
import { Package, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderProductInfoProps {
  product?: {
    id: number;
    title: string;
    images?: string[];
  };
  orderId: number;
}

export default function OrderProductInfo({ product, orderId }: OrderProductInfoProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200 mb-6">
      <div className="flex items-start gap-4 mb-4">
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-eco-100 to-eco-blue-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-eco-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product?.title || "Product"}
          </h3>
          <p className="text-sm text-gray-500">Order #{orderId}</p>
        </div>
      </div>

      <button
        onClick={() => router.push(`/order/${orderId}`)}
        className="w-full px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        View Full Order
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}