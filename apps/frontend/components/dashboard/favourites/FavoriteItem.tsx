"use client";

import { useState } from "react";
import { 
  Heart, 
  MapPin, 
  Eye, 
  MessageCircle, 
  Tag, 
  Star,
  Clock,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FavoriteItem as FavoriteItemType } from "@/lib/types/dashboard/favourites/favourites";

interface FavoriteItemProps {
  favorite: FavoriteItemType;
  onRemoveFavorite: (favoriteId: string) => void;
  onAddToCart: (itemId: string) => void;
}

export default function FavoriteItem({ 
  favorite, 
  onRemoveFavorite, 
  onAddToCart 
}: FavoriteItemProps) {
  const [isLiked, setIsLiked] = useState(true);

  const handleRemoveFavorite = () => {
    setIsLiked(false);
    setTimeout(() => onRemoveFavorite(favorite.id), 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'good':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fair':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getExchangeTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-50 text-green-700 border-eco-200';
      case 'exchange':
        return 'bg-blue-50 text-green-blue-700 border-eco-blue-200';
      case 'donation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Image and Status */}
      <div className="relative">
        <img
          src={favorite.item.image}
          alt={favorite.item.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(favorite.item.status)}`}>
            {favorite.item.status.charAt(0).toUpperCase() + favorite.item.status.slice(1)}
          </span>
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getExchangeTypeColor(favorite.item.exchangeType)}`}>
            <Tag className="w-3 h-3" />
            <span>
              {favorite.item.exchangeType === 'sale' ? 'Sale' :
               favorite.item.exchangeType === 'exchange' ? 'Exchange' : 'Free'}
            </span>
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleRemoveFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            isLiked 
              ? "bg-red-500 text-white" 
              : "bg-white/80 text-gray-700"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </button>

        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(favorite.item.condition)}`}>
            {favorite.item.condition.charAt(0).toUpperCase() + favorite.item.condition.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-2">
          <Link 
            href={`/item/${favorite.item.id}`}
            className="flex-1 min-w-0"
          >
            <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 pr-2">
              {favorite.item.title}
            </h3>
          </Link>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-green-600">
              {favorite.item.exchangeType === 'donation' 
                ? 'FREE' 
                : `Rs ${favorite.item.price.toLocaleString()}`
              }
            </div>
            {favorite.item.originalPrice && favorite.item.exchangeType === 'sale' && (
              <div className="text-sm text-gray-500 line-through">
                Rs {favorite.item.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {/* <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {favorite.item.description}
        </p> */}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{favorite.item.views} views</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{favorite.item.distance} km</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{formatTimeAgo(favorite.addedAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <img
              src={favorite.item.seller.avatar}
              alt={favorite.item.seller.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-900">
              {favorite.item.seller.name}
            </span>
            {favorite.item.seller.verified && (
              <span className="text-blue-500 text-xs">✓</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{favorite.item.seller.rating}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/chat?user=${favorite.item.seller.id}&item=${favorite.item.id}`}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Seller</span>
          </Link>

          <div className="flex items-center space-x-2">
            {favorite.item.status === 'available' && favorite.item.exchangeType !== 'donation' && (
              <button
                onClick={() => onAddToCart(favorite.item.id)}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {favorite.item.exchangeType === 'exchange' ? 'Request Exchange' : 'Add to Cart'}
                </span>
              </button>
            )}
            
            {favorite.item.status === 'available' && favorite.item.exchangeType === 'donation' && (
              <button
                onClick={() => onAddToCart(favorite.item.id)}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                <span>Get for Free</span>
              </button>
            )}

            {favorite.item.status !== 'available' && (
              <span className="text-sm text-gray-500 italic">
                {favorite.item.status === 'sold' ? 'Sold Out' : 'Reserved'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}