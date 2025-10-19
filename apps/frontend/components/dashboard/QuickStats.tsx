"use client";

import { DashboardStats } from "@/lib/types/dashboard/types";
import { TrendingUp, Package, MessageCircle, DollarSign, ShoppingCart, Star } from "lucide-react";

interface QuickStatsProps {
  stats: DashboardStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: "Items for Sale",
      value: stats.itemsForSale,
      icon: Package,
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Items Sold",
      value: stats.itemsSold,
      icon: TrendingUp,
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Total Earnings",
      value: `Rs ${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageCircle,
      color: "bg-purple-500",
      textColor: "text-purple-600"
    },
    {
      title: "Items Bought",
      value: stats.itemsBought,
      icon: ShoppingCart,
      color: "bg-orange-500",
      textColor: "text-orange-600"
    },
    {
      title: "Positive Reviews",
      value: stats.positiveReviews,
      icon: Star,
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-xl font-bold ${stat.textColor} mt-1`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}