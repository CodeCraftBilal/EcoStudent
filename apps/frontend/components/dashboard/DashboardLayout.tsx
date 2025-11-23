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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadItem = async (data: UploadItemData): Promise<void> => {
    setIsLoading(true);
    setUploadError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('price', data.price.toString());
      formData.append('originalPrice', data.originalPrice?.toString() || '0');
      formData.append('productType', data.category);
      formData.append('subCategory', data.subCategory || '');
      formData.append('productCondition', data.condition);
      formData.append('exchangeType', data.exchangeType);

      // Append images
      data.images.forEach((image, index) => {
        formData.append('images', image);
      });

      // API call to upload item
      const response = await authFetch(`${BACKEND_URL}/product`, {
        method: 'POST',
        body: formData,
        // headers are automatically set by browser for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Something went wrong: ${errorData}` || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log("Item uploaded successfully:", result);
      
      // Show success message
      alert("Item listed successfully!");
      
      // Close modal
      setIsUploadModalOpen(false);
      
      // You might want to refresh the listings here
      // refreshListings();

    } catch (error: any) {
      console.error("Error uploading item:", error);
      setUploadError(error.message || "Failed to upload item. Please try again.");
      
      // Re-throw the error so the modal can handle it too
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
          onUpload={handleUploadItem}
        />
      </div>
    </div>
  );
}