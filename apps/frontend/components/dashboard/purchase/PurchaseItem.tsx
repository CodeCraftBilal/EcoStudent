// Update the PurchaseItem component with modals
"use client";

import {
  Star,
  MapPin,
  Calendar,
  CreditCard,
  MessageCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Purchase } from "@/lib/types/dashboard/purchase/purchase";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ReviewForm from "@/components/dashboard/purchase/ReviewForm";
import LocationMap from "@/components/dashboard/purchase/LocationMap";

interface PurchaseItemProps {
  purchase: Purchase;
  isPurchase: boolean;
  onRatePurchase: (
    purchaseId: string,
    rating: number,
    review: string
  ) => Promise<void> | void;
}

export default function PurchaseItem({
  purchase,
  onRatePurchase,
  isPurchase
}: PurchaseItemProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const pathName = usePathname();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "disputed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Shield className="w-4 h-4" />;
      case "cancelled":
        return <Shield className="w-4 h-4" />;
      case "refunded":
        return <Shield className="w-4 h-4" />;
      case "disputed":
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  // Parse coordinates from meetupLocation string
  const parseCoordinates = (locationString: string) => {
    // Extract coordinates from string like "Lahore, Pakistan (31.5204, 74.3587)"
    const match = locationString.match(/\(([-\d.]+),\s*([-\d.]+)\)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
        name: locationString.split("(")[0].trim(),
      };
    }
    // Fallback coordinates (Lahore coordinates)
    return {
      latitude: 31.5204,
      longitude: 74.3587,
      name: locationString,
    };
  };

  const coordinates = parseCoordinates(purchase.meetupLocation);

  const handleReviewSubmit = async (rating: number, review: string) => {
    await onRatePurchase(purchase.id, rating, review);
  };

  // utils/time.ts
  const getHoursLeft = (dateString: string): string => {
    const targetDate = new Date(dateString);
    const now = new Date();

    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Delivered";

    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursLeft}h ${minutesLeft}m left from Deliver Date`;
  };

  return (
    <>
      {/* Review Form Modal */}
      <ReviewForm
      isSeller={!isPurchase}
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSubmit={handleReviewSubmit}
        purchaseId={purchase.id}
        itemTitle={purchase.item.title}
        currentRating={purchase.rating}
        currentReview={purchase.review ?? ""}
      />

      {/* Location Map Modal */}
      <LocationMap
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
        latitude={purchase.latitude}
        longitude={purchase.longitude}
        locationName={coordinates.name}
        address={purchase.meetupLocation}
      />

      {/* Purchase Card */}
      <div className="bg-white h-90 rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="border-b border-gray-200 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(purchase.status)}`}
              >
                {getStatusIcon(purchase.status)}
                <span>
                  {purchase.status.charAt(0).toUpperCase() +
                    purchase.status.slice(1)}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(purchase.purchaseDate)}
              </span>
            </div>
            <div className="text-lg font-bold text-green-600">
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
                href={`/shop/product/${purchase.item.id}?from=${pathName}`}
                className="block"
              >
                <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                  {purchase.item.title.length > 30
                    ? `${purchase.item.title.slice(0, 30)}...`
                    : purchase.item.title}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {purchase.item.description}
              </p>

              {/* Item Meta */}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    purchase.item.condition === "excellent"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : purchase.item.condition === "good"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
                  }`}
                >
                  {purchase.item.condition.charAt(0).toUpperCase() +
                    purchase.item.condition.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-100">
            <div className="flex items-center space-x-3">
              <img
                src={purchase.seller.avatar}
                alt={purchase.seller.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <Link
                  href={`/profile/${purchase.seller.id}`}
                  className="font-medium text-gray-900 hover:text-green-600 transition-colors text-sm"
                >
                  {purchase.seller.name}
                </Link>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                  <span>{purchase.seller.rating}</span>
                  {purchase.seller.verified && (
                    <span className="text-blue-500 ml-1">✓ Verified</span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/chat?user=${purchase.seller.id}`}
              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </Link>
          </div>

          {/* Purchase Details */}
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-green-100">
            {/* Clickable Meetup Location */}
            <button
              onClick={() => setShowLocationMap(true)}
              className="flex items-center cursor-pointer space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors group flex-1 min-w-0"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left">
                {purchase.meetupLocation}
              </span>
              <span className="text-xs text-green-400 w-22 group-hover:text-green-500">
                View Map
              </span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-green-600" />
              <span>
                {purchase.deliveredDate
                  ? `Delivered ${formatDate(purchase.deliveredDate)}`
                  : "Delivery pending"}
              </span>
            </div>
          </div>

          {/* Rating Section */}
          {purchase.status === "completed" && isPurchase && (
            <div className="mt-4 pt-4 border-t border-green-100">
              {!purchase.rating ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    How was your experience?
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
                  >
                    <Star className="w-4 h-4" />
                    <span>Leave a Review</span>
                  </button>
                </div>
              ) : (
                // Existing Review with edit option
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < purchase.rating!
                                ? "text-eco-sun fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {purchase.rating}/5
                      </span>
                    </div>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      Edit Review
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{purchase.review}</p>
                </div>
              )}
            </div>
          )}

          {/* canceled order */}
          {purchase.status === "cancelled" && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-100">
              <p className="text-sm text-gray-600">The Order were cancelled</p>
              {/* <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
              ></button> */}
            </div>
          )}
          {/* canceled order */}
          {purchase.status === "pending" && (
            <div className="mt-4 pt-4 border-t border-green-100">
              <p className="text-sm font-bold text-center text-green-600">{getHoursLeft(purchase.deliveredDate)}</p>
              {/* <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
              ></button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
