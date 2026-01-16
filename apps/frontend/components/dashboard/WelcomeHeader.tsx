"use client";

import { Bell, Cross, Settings, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface WelcomeHeaderProps {
  userName: string;
  unreadNotifications: number;
}

export default function WelcomeHeader({ 
  userName, 
  unreadNotifications 
}: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const [isOpen, setIsOpen] = useState(true);
  const handleOpen = () => {
    setIsOpen(false);
  }
  return (
    <div className={`${isOpen ? '' : 'hidden'} bg-white rounded-2xl p-6 shadow-sm mb-6 relative`}>
      <button 
      onClick={handleOpen}
      className="absolute right-3 top-2">
        <X color="black" />
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to your EcoStudent dashboard. Here's what's happening with your account.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          <Link
          href={'/dashboard/profile'}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}