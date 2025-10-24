"use client";

import { Package, ShoppingBag, DollarSign, Star, MessageCircle, TrendingUp } from "lucide-react";
import { ProfileStats as ProfileStatsType } from "@/lib/types/dashboard/profile/types";

interface ProfileStatsProps {
  stats: ProfileStatsType;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statCards = [
    {
      title: "Active Listings",
      value: stats.totalListings,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Items Sold",
      value: stats.itemsSold,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Items Bought",
      value: stats.itemsBought,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Earnings",
      value: `Rs ${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Rating",
      value: stats.rating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Reviews",
      value: stats.reviewsCount,
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} mb-2`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className={`text-lg font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
}