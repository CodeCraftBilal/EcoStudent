"use client";

import { BACKEND_URL } from "@/lib/constants";
import { Conversation } from "@/lib/types/messages/types";
import {
  Package,
  ExternalLink,
  DollarSign,
  MapPin,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  images?: string[];
}

interface PageProps {
  conversation: Conversation;
}

export default function BuyerOrderPriorInfo({ conversation }: PageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <div className="flex items-start gap-4 mb-4">
          {conversation.item?.image?.[0] ? (
            <img
              src={conversation.item.image[0]}
              alt={conversation.item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-eco-100 to-eco-blue-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-eco-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {conversation.item?.title || "Product"}
            </h3>
          </div>
        </div>

        <Link
          href={`/shop/product/${conversation.item?.id}?from=dashboard/chat?conversationId=${conversation.id}`}
          className="w-full px-4 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          View Item
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Price */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4" />
          Price
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            RS {conversation.item?.price ? conversation.item?.price : "0.00"}
          </span>
          {conversation.item?.price && (
            <span className="text-sm text-gray-500 line-through">
              Original: RS {conversation.item.price}
            </span>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Meetup Location
          </h4>
          <button className="text-sm text-eco-600 hover:text-eco-700 flex items-center gap-1">
            View Map
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="p-3 bg-eco-50 rounded-lg border border-eco-200">
          <p className="text-gray-900">Ask Seller for meetup location</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500"></div>
        </div>
      </div>

      {/* Order Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-col items-center gap-2 text-sm">
            <button
              disabled={true}
              className="w-full px-4 py-3 bg-linear-to-r from-eco-500 to-eco-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <>
                <CheckCircle className="w-5 h-5" />
                Accept Order
              </>
            </button>
            <p className="text-sm text-gray-600 mt-1">
              Ask Seller to create order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
