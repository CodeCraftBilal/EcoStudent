"use client";

import { Heart, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Item } from "@/lib/types/types";
import Image from "next/image";

interface ItemCardProps {
  item: Item;
  index: number;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (itemId: string) => void;
  onToggleCart: (itemId: string) => void;
}

export function ItemCard({
  item,
  index,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onToggleCart,
}: ItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white cursor-default rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link
          className="relative overflow-hidden"
          href={`/shop/product/${item.id}?category=${item.category}`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-28 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart
              className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
        </div>
        <div className="absolute top-2 left-2">
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              item.exchangeType === "sale"
                ? "bg-green-100 text-green-800"
                : item.exchangeType === "exchange"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
            }`}
          >
            {item.exchangeType === "sale"
              ? "Sale"
              : item.exchangeType === "exchange"
                ? "Exchange"
                : "Free"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 sm:p-4">
        {/* Mobile Compact View */}
        <Link href={`/shop/product/${item.id}?category=${item.category}`} className="sm:hidden">
          <h3
            className={`font-semibold text-gray-900 text-sm max-md:h-10 line-clamp-2 ${item.title.length < 25 ? "min-h-[2rem]" : ""}`}
          >
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {item.exchangeType === "donation" ? (
                <span className="text-sm font-bold text-green-600">FREE</span>
              ) : (
                <span className="text-sm font-bold text-gray-600">
                  Rs {item.price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{item.distance}km</span>
            </div>
          </div>
        </Link>

        {/* Desktop Detailed View */}
        <div className="hidden sm:block">
          <Link href={`/shop/product/${item.id}?category=${item.category}`}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                {item.title}
              </h3>
            </div>

            {/* <p className="text-gray-600 text-sm mb-1 line-clamp-2">
            {item.description}
          </p> */}

            {/* Price and Distance */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center space-x-2">
                {item.exchangeType === "donation" ? (
                  <span className="text-lg font-bold text-green-600">FREE</span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-green-600">
                      Rs {item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        Rs {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{item.distance} km</span>
              </div>
            </div>
          </Link>
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full relative">
                {item.seller.profilePicture ? (
                  <Image
                    fill
                    src={item.seller.profilePicture}
                    alt={item.seller.name}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center font-bold text-green-600">
                    {item.seller.name[0]}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700">{item.seller.name}</span>
              {item.seller.verified && (
                <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-yellow-600">⭐ {item.rating}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {/* <button
              onClick={() => onToggleCart(item.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                isInCart
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isInCart ? "Added to Cart" : 
               item.exchangeType === "exchange" ? "Request Exchange" :
               item.exchangeType === "donation" ? "Get for Free" : "Add to Cart"}
            </button> */}
            <Link
              className={`flex-1 text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-green-500 text-white hover:bg-green-600`}
              href={`/dashboard/chat?user=${item.seller.name}`}
            >
              Message Seller
            </Link>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Action Button */}
        <div className="sm:hidden mt-2">
          <button
            onClick={() => onToggleCart(item.id)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              isInCart
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isInCart
              ? "Added"
              : item.exchangeType === "exchange"
                ? "Exchange"
                : item.exchangeType === "donation"
                  ? "Get Free"
                  : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
