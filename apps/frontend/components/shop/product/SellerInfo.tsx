import { MapPin, Star, Shield, Verified } from "lucide-react";
import Link from "next/link";

interface Seller {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  memberSince: string;
  itemsSold: number;
  responseRate: number;
  avatar: string;
}

interface SellerInfoProps {
  seller: Seller;
  distance: number;
  onMessageSeller: () => void;
}

export default function SellerInfo({ 
  seller, 
  distance, 
  onMessageSeller 
}: SellerInfoProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {seller.name}
            </h3>
            {seller.verified && (
              <Verified className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{seller.rating} Rating</span>
            </div>
            <span>•</span>
            <span>{seller.itemsSold} Items Sold</span>
            <span>•</span>
            <span>Member since {seller.memberSince}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>{seller.responseRate}% Response Rate</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span>{distance} km away</span>
        </div>
      </div>

      <Link
        // onClick={onMessageSeller}
        href={`/chat?user=${seller.id}`}
        className="block w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-2xl font-semibold transition-colors text-center"
      >
        Message Seller
      </Link>
    </div>
  );
}