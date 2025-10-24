"use client";

import { Star, MapPin, Calendar, CreditCard, MessageCircle, Shield } from "lucide-react";
import Link from "next/link";
import { Purchase } from "@/lib/types/dashboard/purchase/purchase";

interface PurchaseItemProps {
  purchase: Purchase;
  onRatePurchase: (purchaseId: string, rating: number, review: string) => void;
}

export default function PurchaseItem({ purchase, onRatePurchase }: PurchaseItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Shield className="w-4 h-4" />;
      case 'cancelled':
        return <Shield className="w-4 h-4" />;
      case 'refunded':
        return <Shield className="w-4 h-4" />;
      case 'disputed':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'jazzcash':
        return <CreditCard className="w-4 h-4" />;
      case 'easypaisa':
        return <CreditCard className="w-4 h-4" />;
      case 'cash':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(purchase.status)}`}>
              {getStatusIcon(purchase.status)}
              <span>{purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}</span>
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(purchase.purchaseDate)}
            </span>
          </div>
          <div className="text-lg font-bold text-eco-600">
            {formatCurrency(purchase.totalAmount)}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex space-x-4">
          {/* Item Image */}
          <img
            src={purchase.item.image}
            alt={purchase.item.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <Link 
              href={`/item/${purchase.item.id}`}
              className="block"
            >
              <h3 className="font-semibold text-gray-900 hover:text-eco-600 transition-colors line-clamp-2">
                {purchase.item.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {purchase.item.description}
            </p>

            {/* Item Meta */}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs ${
                purchase.item.condition === 'excellent' ? 'bg-green-50 text-green-700 border border-green-200' :
                purchase.item.condition === 'good' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                {purchase.item.condition.charAt(0).toUpperCase() + purchase.item.condition.slice(1)}
              </span>
              <span>•</span>
              <span>Qty: {purchase.quantity}</span>
              <span>•</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(purchase.item.price)} each
              </span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src={purchase.seller.avatar}
              alt={purchase.seller.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <Link 
                href={`/profile/${purchase.seller.id}`}
                className="font-medium text-gray-900 hover:text-eco-600 transition-colors text-sm"
              >
                {purchase.seller.name}
              </Link>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{purchase.seller.rating}</span>
                {purchase.seller.verified && (
                  <span className="text-blue-500 ml-1">✓ Verified</span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/chat?user=${purchase.seller.id}`}
            className="flex items-center space-x-1 text-eco-600 hover:text-eco-700 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Link>
        </div>

        {/* Purchase Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-eco-600" />
            <span className="truncate">{purchase.meetupLocation}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-eco-600" />
            <span>
              {purchase.deliveredDate 
                ? `Delivered ${formatDate(purchase.deliveredDate)}`
                : 'Delivery pending'
              }
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {getPaymentMethodIcon(purchase.paymentMethod)}
            <span className="capitalize">{purchase.paymentMethod}</span>
          </div>
        </div>

        {/* Rating Section */}
        {purchase.status === 'completed' && !purchase.rating && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">How was your experience?</p>
              <button
                onClick={() => onRatePurchase(purchase.id, 5, "Great experience!")}
                className="flex items-center space-x-1 text-eco-600 hover:text-eco-700 transition-colors text-sm font-medium"
              >
                <Star className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            </div>
          </div>
        )}

        {/* Existing Review */}
        {purchase.rating && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < purchase.rating! 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{purchase.review}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}