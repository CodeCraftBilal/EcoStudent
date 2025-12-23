"use client";
import { useSnackbar } from "@/components/ui/dialogBoxes/SnackBarManager";
import { authFetch } from "@/lib/authFetch";
import { getUserLocation } from "@/lib/location";
import { BACKEND_URL } from "@/lib/types/constants";
import { MapPin, Star, Shield, Verified } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface Seller {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  memberSince: string;
  // itemsSold: number;
  // responseRate: number;
  avatar: string;
}

interface SellerInfoProps {
  seller: Seller;
  distance: number;
  productId: string;
  // onMessageSeller: () => void;
}

export default function SellerInfo({ seller, distance, productId }: SellerInfoProps) {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { showError } = useSnackbar();
  const handleMessageSeller = async (sellerId: string, pId: string = productId) => {
    console.log(`sellerId: ${sellerId}, productId: ${productId}`);
    setIsCreatingChat(true);
    await getUserLocation(true);
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
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-4 mb-4">
        {seller.avatar ? (
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="md:w-16 md:h-16 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <p className="font-bold md:text-3xl text-lg">
              {seller.name[0].toUpperCase()}
            </p>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {seller.name}
            </h3>
            {seller.verified && <Verified className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{seller.rating} Rating</span>
            </div>
            <span>•</span>
            {/* <span>{seller.itemsSold} Items Sold</span> */}
            {/* <span>•</span> */}
            <span>
              Member since{" "}
              {seller.memberSince &&
                new Date(seller.memberSince).toISOString().split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        {/* <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>{seller.responseRate}% Response Rate</span>
        </div> */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span>{distance} km away</span>
        </div>
      </div>

      <button
        onClick={() => handleMessageSeller(seller.id)}
        className="block w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 rounded-2xl font-semibold transition-colors text-center"
      >
        Message Seller
      </button>
    </div>
  );
}
