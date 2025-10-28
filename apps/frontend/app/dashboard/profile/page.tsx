"use client";

import { useState, useEffect } from "react";
import { 
  ProfileHeader, 
  ProfileStats, 
  ProfileForm,
  ProfileSection 
} from "@/components/dashboard/profile";
import { UserProfile, ProfileStats as ProfileStatsType } from "@/lib/types/dashboard/profile/types";
import { useSession } from "@/context/useSession";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const {session, isLoading} = useSession();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProfile: UserProfile = {
      id: session?.userId || '',
      name: session?.userName || '',
      email: session?.email || '',
      phone: "+92 300 1234567",
      avatar: session?.profile || "/api/placeholder/200/200",
      coverImage: session?.profile || "/api/placeholder/800/200",
      bio: "Computer Science student passionate about technology and sustainability. Love exchanging books and helping fellow students save money while protecting the environment.",
      location: "Mianwali, Pakistan",
      userType: "student",
      institution: "University of Mianwali",
      course: "Bachelor of Computer Science",
      semester: "5th",
      joinDate: "2023-09-01",
      isVerified: true,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        priceDropAlerts: true,
        nearbyItemAlerts: true
      },
      socialLinks: {
        facebook: "https://facebook.com/alistudent",
        twitter: "https://twitter.com/alistudent",
        instagram: "https://instagram.com/alistudent"
      }
    };

    setProfile(mockProfile);
    // setIsLoading(false);
  }, [isLoading]);

  // Mock stats - replace with actual API call
  const stats: ProfileStatsType = {
    totalListings: 12,
    itemsSold: 8,
    itemsBought: 15,
    totalEarnings: 18500,
    rating: 4.8,
    reviewsCount: 24,
    responseRate: 95,
    completionRate: 98
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    // Here you would typically send the updated profile to your backend
    console.log("Saving profile:", updatedProfile);
  };

  const handleCoverImageChange = (file: File) => {
    console.log("Updating cover image:", file);
    // Implement cover image upload logic
  };

  const handleAvatarChange = (file: File) => {
    console.log("Updating avatar:", file);
    // Implement avatar upload logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onCoverImageChange={handleCoverImageChange}
          onAvatarChange={handleAvatarChange}
          onEditToggle={() => setIsEditing(!isEditing)}
        />

        {/* Profile Stats */}
        {!isEditing && <ProfileStats stats={stats} />}

        {/* Profile Content */}
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* View Mode - Additional Info */}
            <ProfileSection title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{profile.phone || "Not provided"}</p>
                </div>
              </div>
            </ProfileSection>

            {/* Social Links */}
            {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
              <ProfileSection title="Social Links">
                <div className="flex flex-wrap gap-4">
                  {profile.socialLinks.facebook && (
                    <a 
                      href={profile.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">f</span>
                      </span>
                      <span>Facebook</span>
                    </a>
                  )}
                  
                  {profile.socialLinks.twitter && (
                    <a 
                      href={profile.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <span className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">𝕏</span>
                      </span>
                      <span>Twitter</span>
                    </a>
                  )}
                  
                  {profile.socialLinks.instagram && (
                    <a 
                      href={profile.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">📷</span>
                      </span>
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {profile.socialLinks.linkedin && (
                    <a 
                      href={profile.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">in</span>
                      </span>
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </ProfileSection>
            )}

            {/* Notification Preferences */}
            <ProfileSection title="Notification Preferences">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Notifications</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.preferences.emailNotifications 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">SMS Notifications</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.preferences.smsNotifications 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.preferences.smsNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Price Drop Alerts</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.preferences.priceDropAlerts 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.preferences.priceDropAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Nearby Item Alerts</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.preferences.nearbyItemAlerts 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.preferences.nearbyItemAlerts ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </ProfileSection>
          </div>
        )}
      </div>
    </div>
  );
}