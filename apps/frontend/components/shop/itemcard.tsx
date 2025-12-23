"use client";

import {
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { Item } from "@/lib/types/types";
import Image from "next/image";
import React, { MouseEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useSnackbar } from "../ui/dialogBoxes/SnackBarManager";
import { getUserLocation } from "@/lib/location";

interface ItemCardProps {
  item: Item;
  index: number;
  isFavorite: boolean;
  isInCart?: boolean;
  onToggleFavorite: (itemId: string) => void;
  onToggleCart?: (itemId: string) => void;
}

const ItemCard = React.memo(
  ({
    item,
    index,
    isFavorite,
    isInCart,
    onToggleFavorite,
    onToggleCart,
  }: ItemCardProps) => {
    // from filter
    const pathName = usePathname();
    const { showError } = useSnackbar();
    console.log(pathName);

    const [isCreatingChat, setIsCreatingChat] = useState(false);

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.round(diffInDays / 365)} years ago`;
    };

    const toCameCase = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const router = useRouter();
    // const [loadingChat, setLoadingChat] = useState(null)
    const handleMessageSeller = async (sellerId: string, productId: string) => {
      console.log(`sellerId: ${sellerId}, productId: ${productId}`);
      setIsCreatingChat(true);
      await getUserLocation(true)
      try {
        const response = await authFetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: Number(sellerId),
            productId: Number(productId),
          }),
        });

        if (!response.ok) {
          console.log(response.statusText);
          throw new Error(`Failed to create chat!`);
        }

        const result = await response.json();
        console.log("Created chat: ", result);

        setIsCreatingChat(false);
        // Pass the chat ID and newChat flag
        const link = `/dashboard/chat?conversationId=${result.id}&newChat=true&from=${pathName}`;
        router.push(link);
      } catch (err) {
        setIsCreatingChat(false);
        showError(`${err}`, 3000, "bottom-center");
        console.error(err);
      }
    };

    return (
      <div className="bg-white cursor-default rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <Link
            className="relative overflow-hidden"
            href={`/shop/product/${item.id}?category=${item.category}&from=${pathName}`}
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
          {/* exchangeType */}
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

          {/* category */}
          <div className="absolute top-8 left-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                item.category === "books" || item.category === "bags"
                  ? "bg-green-100 text-green-800"
                  : item.category === "uniform" ||
                      item.category === "calculator"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {toCameCase(item.category)}
            </span>
          </div>

          {/* condition */}
          <div className="absolute bottom-2 left-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                item.condition === "excellent"
                  ? "bg-green-100 text-green-800"
                  : item.condition === "good"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {toCameCase(item.condition)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-2 sm:p-4">
          {/* Mobile Compact View */}
          <Link
            href={`/shop/product/${item.id}?category=${item.category}&from=${pathName}`}
            className="sm:hidden"
          >
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
            <Link
              href={`/shop/product/${item.id}?category=${item.category}&from=${pathName}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                  {item.title}
                </h3>
              </div>

              {/* Price and Distance */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                  {item.exchangeType === "donation" ? (
                    <span className="text-lg font-bold text-green-600">
                      FREE
                    </span>
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
                <span className="text-sm text-gray-700">
                  {item.seller.name}
                </span>
                {item.seller.verified && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    &#x2713;
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-yellow-600">
                  ⭐ {item.seller.rating}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleMessageSeller(item.seller.id, item.id)}
                className={`flex-1 text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-green-500 text-white hover:bg-green-600`}
              >
                {isCreatingChat ? "Creating Chat..." : "Message Seller"}
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* favorite item display */}
          {item.favorite && (
            <div className="flex mt-2 justify-between">
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {formatTimeAgo(item.favorite?.addedAt)}
                </span>
              </div>

              {/* status */}
              <div className="flex items-center space-x-2">
                {item.favorite?.status && (
                  <span className="text-sm text-gray-500 italic">
                    {item.favorite?.status.charAt(0).toUpperCase() +
                      item.favorite.status.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ItemCard;
