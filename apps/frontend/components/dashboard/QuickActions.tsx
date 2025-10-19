"use client";

import { 
  Plus, 
  Package, 
  MessageCircle, 
  Heart, 
  User, 
  MapPin,
  ShoppingCart,
  Star
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onUploadItem: () => void;
}

export default function QuickActions({ onUploadItem }: QuickActionsProps) {
  const actions = [
    {
      title: "Sell an Item",
      description: "Upload books, uniforms, or supplies",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      onClick: onUploadItem
    },
    {
      title: "My Listings",
      description: "Manage your items for sale",
      icon: Package,
      color: "bg-blue-500 hover:bg-blue-600",
      href: "/dashboard/listings"
    },
    {
      title: "Messages",
      description: "Chat with buyers & sellers",
      icon: MessageCircle,
      color: "bg-purple-500 hover:bg-purple-600",
      href: "/chat"
    },
    {
      title: "My Purchases",
      description: "View items you bought",
      icon: ShoppingCart,
      color: "bg-green-500 hover:bg-green-600",
      href: "/dashboard/purchases"
    },
    {
      title: "Favorites",
      description: "Saved items you like",
      icon: Heart,
      color: "bg-pink-500 hover:bg-pink-600",
      href: "/dashboard/favorites"
    },
    {
      title: "My Profile",
      description: "Edit your information",
      icon: User,
      color: "bg-orange-500 hover:bg-orange-600",
      href: "/dashboard/profile"
    },
    {
      title: "Nearby Items",
      description: "Find items close to you",
      icon: MapPin,
      color: "bg-[#3B82F6] hover:bg-[#3B82F6]",
      href: "/shop?filter=nearby"
    },
    {
      title: "My Reviews",
      description: "See your ratings & feedback",
      icon: Star,
      color: "bg-yellow-500 hover:bg-yellow-600",
      href: "/dashboard/reviews"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const ActionComponent = action.href ? Link : 'button';
          
          return (
            <ActionComponent
              key={index}
              href={action.href || '#'}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl text-white ${action.color} transition-all hover:scale-105 group`}
            >
              <action.icon className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm text-center">{action.title}</span>
              <span className="text-xs text-white text-opacity-80 text-center mt-1 group-hover:text-opacity-100">
                {action.description}
              </span>
            </ActionComponent>
          );
        })}
      </div>
    </div>
  );
}