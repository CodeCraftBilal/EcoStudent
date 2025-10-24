"use client";

import { Package, DollarSign, CheckCircle, Star } from "lucide-react";
import { PurchaseStats as PurchaseStatsType } from "@/lib/types/dashboard/purchase/purchase";

interface PurchaseStatsProps {
  stats: PurchaseStatsType;
}

export default function PurchaseStats({ stats }: PurchaseStatsProps) {
  const statCards = [
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Spent",
      value: `Rs ${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "text-eco-600",
      bgColor: "bg-eco-50"
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
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