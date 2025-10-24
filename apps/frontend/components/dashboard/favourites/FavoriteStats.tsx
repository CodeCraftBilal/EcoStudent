"use client";

import { Heart, Package, TrendingDown, MapPin } from "lucide-react";
import { FavoriteStats as FavoriteStatsType } from "@/lib/types/dashboard/favourites/favourites";

interface FavoriteStatsProps {
  stats: FavoriteStatsType;
}

export default function FavoriteStats({ stats }: FavoriteStatsProps) {
  const statCards = [
    {
      title: "Total Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Available Now",
      value: stats.availableItems,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Price Drops",
      value: stats.priceDrops,
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Nearby Items",
      value: stats.nearbyItems,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-xl font-bold ${stat.color} mt-1`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}