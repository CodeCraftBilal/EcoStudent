import { desc } from "framer-motion/client";
import { Star, Clock, Share2, Flag } from "lucide-react";
import { useState } from "react";

interface ProductInfoProps {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  condition: string;
  exchangeType: string;
  postedDate: string;
  views: number;
  onShare: () => void;
  onReport: () => void;
}

export default function ProductInfo({
  title,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  condition,
  exchangeType,
  postedDate,
  views,
  onShare,
  onReport,
}: ProductInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  console.log("description ", description);
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExchangeTypeColor = (type: string) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800";
      case "exchange":
        return "bg-blue-100 text-blue-800";
      case "donation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Badges */}
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`text-sm px-3 py-1 rounded-full ${getExchangeTypeColor(exchangeType)}`}
            >
              {exchangeType === "sale"
                ? "For Sale"
                : exchangeType === "exchange"
                  ? "For Exchange"
                  : "Free Donation"}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${getConditionColor(condition)}`}
            >
              {condition.charAt(0).toUpperCase() + condition.slice(1)} Condition
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

          {/* Meta Info */}
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{rating}</span>
              <span>({reviewCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                Posted {new Date(postedDate).toISOString().split("T")[0]}
              </span>
            </div>
            {/* <span>•</span>
            <span>{views} views</span> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onShare}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={onReport}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-bold text-green-600">
          Rs {price.toLocaleString()}
        </span>
        {originalPrice && (
          <span className="text-2xl text-gray-500 line-through">
            Rs {originalPrice.toLocaleString()}
          </span>
        )}
        {originalPrice && (
          <span className="text-lg font-semibold text-green-600">
            {Math.round((1 - price / originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {description ? (
          <p className="text-gray-700 leading-relaxed">
            {description && showFullDescription
              ? description
              : `${description.slice(0, 200)}...`}
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-2 text-green-600 hover:text-green-700 font-medium"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          </p>
        ) : (
          <p>No description available for this product.</p>
        )}
      </div>
    </div>
  );
}
