"use client";

import { useState, useEffect } from "react";
import {
  ProfileHeader,
  ProfileStats,
  ProfileForm,
  ProfileSection,
} from "@/components/dashboard/profile";
import {
  UserProfile as UserProfileType,
  ProfileStats as ProfileStatsType,
} from "@/lib/types/dashboard/profile/types";
import { useSession } from "@/context/useSession";
import { DashboardLoader } from "@/components/Loading";
import { LocationEdit } from "lucide-react";
import { getUserLocation } from "@/lib/location";
import {
  ErrorDialog,
  SuccessDialog,
} from "@/components/ui/dialogBoxes/Pre-configuredDialog";
import { authFetch } from "@/lib/authFetch";

type ProfileAPIResponse = {
  user: UserProfileType;
  stats: ProfileStatsType;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const { session, isLoading } = useSession();
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [stats, setStats] = useState<ProfileStatsType>({
    totalListings: 0,
    itemsSold: 0,
    itemsBought: 0,
    totalEarnings: 0,
    rating: 0,
    reviewsCount: 0,
  });
  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProfile: UserProfileType = {
      id: session?.userId || "",
      name: session?.userName || "",
      email: session?.email || "",
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
    };

    setProfile(mockProfile);

    const fetchUserProfile = async () => {
      if (isLoading && !session) return;
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`
        );

        if (!res.ok) {
          throw new Error("failed to fetch Profile data");
        }

        const result: ProfileAPIResponse = await res.json();
        console.log(result);
        setStats(result.stats);
        setProfile(result.user);
      } catch (err) {
        console.error(`profile error ${err}`);
      }
    };

    fetchUserProfile();
  }, [isLoading]);

  const handleSaveProfile = async (updatedProfile: UserProfileType) => {
    setIsEditing(false);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${session?.userId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            userName: updatedProfile.name,
            email: updatedProfile.email,
            phoneNumber: updatedProfile.phone,
            userLocation: updatedProfile.location,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Profile update failed");
      }

      const result = await res.json();
      console.log("resutl ", result);
      setProfile(updatedProfile);
    } catch (err) {
      console.log("Profile Update Error ", err);
      console.log("Saving profile:", updatedProfile);
    }
  };

  const handleCoverImageChange = (file: File) => {
    console.log("Updating cover image:", file);
    // Implement cover image upload logic
  };

  const handleAvatarChange = async (file: File) => {
    console.log("Updating avatar:", file);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/updateprofile`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Profile update failed");
      }

      const result = await res.json();
      console.log("resutl ", result);
    } catch (err) {
      console.log("Profile Update Error ", err);
    }
    // Implement avatar upload logic
  };

  // update location
  const handleUpdateLocation = async () => {
    console.log("updateing location");
    const location = await getUserLocation(true);
    console.log(location);
    if (!location) {
      console.log("location access is denied");
      setErrorDialog(true);
      return;
    }

    try {
      console.log("bu ", process.env.NEXT_PUBLIC_BACKEND_URL);
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/updatelocation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }
      );
      if (!res.ok) throw new Error("Location Update Error!");

      console.log("location updated");
      setSuccessDialog(true);
    } catch (err) {
      console.error("Location Error ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <DashboardLoader />
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600">
            Unable to load your profile information.
          </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </ProfileSection>

            <ProfileSection title="Address & Location">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-900">{profile.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <button
                    className="flex gap-2 px-3 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                    onClick={handleUpdateLocation}
                  >
                    <LocationEdit />
                    Update Current Location
                  </button>
                  {successDialog ? (
                    <SuccessDialog
                      title="Location Updated"
                      description="Your Current Location is Updated Successfuly"
                      isOpen={successDialog}
                      onClose={() => setSuccessDialog(false)}
                      buttons={[
                        {
                          text: "ok",
                          onClick: () => setSuccessDialog(false),
                        },
                      ]}
                    />
                  ) : errorDialog ? (
                    <ErrorDialog
                      title="Location Access Denied"
                      description="Please allow us to access your location"
                      isOpen={errorDialog}
                      onClose={() => setErrorDialog(false)}
                    />
                  ) : null}
                </div>
              </div>
            </ProfileSection>

            {/* Social Links */}
            {/* {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
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
            )} */}

            {/* Notification Preferences */}
            {/*<ProfileSection title="Notification Preferences">
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
            </ProfileSection> */}
          </div>
        )}
      </div>
    </div>
  );
}
