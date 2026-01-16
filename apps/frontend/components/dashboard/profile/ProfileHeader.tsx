"use client";

import { useState } from "react";
import { Camera, Edit3, MapPin, Calendar, Shield } from "lucide-react";
import { UserProfile } from "@/lib/types/dashboard/profile/types";
import AvatarUpload from "./AvatarUpload";

interface ProfileHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  onCoverImageChange: (file: File) => void;
  onAvatarChange: (file: File) => void;
  onEditToggle: () => void;
}

export default function ProfileHeader({
  profile,
  isEditing,
  onCoverImageChange,
  onAvatarChange,
  onEditToggle
}: ProfileHeaderProps) {
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'student':
        return 'Student';
      case 'teacher':
        return 'Teacher';
      case 'alumni':
        return 'Alumni';
      default:
        return 'Member';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-5">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-eco-500 to-eco-blue-500">
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Change Cover</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onCoverImageChange(e.target.files[0])}
              />
            </label>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.isVerified && (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatJoinDate(profile.joinDate)}</span>
                </div>
                
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {getUserTypeLabel(profile.userType)}
                </span>
              </div>

              {profile.institution && (
                <p className="text-gray-700 font-medium">
                  {profile.institution}
                  {profile.course && ` • ${profile.course}`}
                  {profile.semester && ` • Semester ${profile.semester}`}
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-4 md:mt-0">
            <button
              onClick={onEditToggle}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                isEditing
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-green-500 text-white hover:bg-green-600 shadow-lg"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUpload
        isOpen={showAvatarUpload}
        onClose={() => setShowAvatarUpload(false)}
        onUpload={onAvatarChange}
        currentAvatar={profile.avatar}
      />
    </div>
  );
}