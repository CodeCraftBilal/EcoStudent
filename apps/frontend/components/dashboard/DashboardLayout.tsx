"use client";

import { useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import QuickStats from "./QuickStats";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import MyListings from "./MyListings";
import UploadItemModal from "./UploadItemModal";
import { DashboardStats, Listing, Activity, UploadItemData } from "@/lib/types/dashboard/types";
import { BACKEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";

interface DashboardLayoutProps {
  userName: string;
  stats: DashboardStats;
  listings: Listing[];
  activities: Activity[];
}

export default function DashboardLayout({
  userName,
  stats,
  listings,
  activities
}: DashboardLayoutProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <WelcomeHeader 
          userName={userName} 
          unreadNotifications={stats.unreadMessages} 
        />
        
        <QuickStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions onUploadItem={() => setIsUploadModalOpen(true)} />
          </div>
          
          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* My Listings */}
        <div className="mt-6">
          <MyListings listings={listings} />
        </div>

        {/* Upload Modal */}
        <UploadItemModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          setIsUploadModalOpen={setIsUploadModalOpen }
        />
      </div>
    </div>
  );
}