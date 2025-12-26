"use client";

import { Phone, Video, MoreVertical, Star, ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/types/messages/types";

interface ChatHeaderProps {
  user: User;
  onCall: () => void;
  onVideoCall: () => void;
  onMenuClick: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showReturnToWebsite?: boolean;
}

export default function ChatHeader({
  user,
  onCall,
  onVideoCall,
  onMenuClick,
  onBack,
  showBackButton = false,
  showReturnToWebsite = true
}: ChatHeaderProps) {
  return (
    <div className="bg-white/90 border-b border-gray-200 p-4 flex items-center justify-between max-md:sticky top-15 z-10">
      {/* Left Section - Back Button and User Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors flex-shrink-0 mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-900 truncate">{user.name}</h2>
              {user.verified && (
                <div className="flex items-center space-x-1 text-blue-500 flex-shrink-0">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {user.isOnline ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span className="truncate">Last seen {user.lastSeen}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {showReturnToWebsite && (
          <Link
            href="/"
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors sm:hidden"
          >
            <Home className="w-5 h-5" />
          </Link>
        )}
        
        {/* <button
          onClick={onCall}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
        >
          <Phone className="w-5 h-5" />
        </button> */}
        
        {/* <button
          onClick={onVideoCall}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
        >
          <Video className="w-5 h-5" />
        </button> */}
        
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}