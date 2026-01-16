"use client";

import { useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import QuickStats from "./QuickStats";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import UploadItemModal from "./UploadItemModal";
import { DashboardStats, Listing, Activity, UploadItemData } from "@/lib/types/dashboard/types";
import { useNotification } from "@/context/useNotification";

interface DashboardLayoutProps {
  userName: string;
  stats: DashboardStats;
  listings: Listing[];
  activities: Activity[];
}

export default function DashboardLayout({
  userName,
  stats,
  activities
}: DashboardLayoutProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const {notifications} = useNotification();


  return (
    <div className="h-screen bg-linear-to-br from-eco-50 to-eco-blue-50 p-4">
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
          <div className="lg:col-span-1 h-[calc(100vh-120px)]">
            <RecentActivity activities={notifications} />
          </div>
        </div>

        {/* My Listings */}
        <div className="mt-6">
          {/* <MyListings listings={listings} /> */}
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