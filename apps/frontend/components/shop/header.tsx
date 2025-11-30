"use client";

import {
  Search,
  MapPin,
  ShoppingCart,
  Filter,
  Leaf,
  NotebookIcon,
  Bell,
  MessageCircleHeartIcon,
  MessageCircle,
  Heart,
  LogOut,
  Home,
  Settings,
  User,
} from "lucide-react";
import { Filters, FiltersProps } from "./filters";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/context/useSession";
import { Session } from "inspector/promises";
import NotificationDropdown from "../dashboard/Notification";
import { notificationsData } from "../dashboard/DashboardNavbar";
import { messagesNotificationData } from "@/data/Notifications";

interface HeaderProps extends FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
}

export function ShopNavBar({
  searchQuery,
  setSearchQuery,
  cartCount,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  onResetFilters,
}: HeaderProps) {
  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 5000],
      condition: [],
      exchangeType: [],
      distance: 10,
    });
    setSearchQuery("");
  };

  // geting param from the session
  let sessionParam = false;
  const param = useSearchParams().get("session");
  if (param === "true") {
    sessionParam = true;
  } else {
    sessionParam = false;
  }
  const { session, isLoading } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isMessagesDropDownOpen, setIsMessagesDropDownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [messages, setMessages] = useState(notificationsData);
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={"/"}
            className="max-md:hidden flex items-center space-x-4"
          >
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">EcoStudent</h1>
          </Link>

          {/* Search Bar in Header */}
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-4 w-full">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for books, uniforms, calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <div className="flex justify-end mb-4 sm:hidden"></div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* show when user is login in */}
            <div
              className={`${session && session.userName ? "flex" : "hidden"} gap-4 items-center justify-center`}
            >
              {/* <Bell className={`w-3 h-3 sm:w-5 sm:h-5 hover:text-green-500 text-gray-600`}/> */}

              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                  }
                  className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  notificationType="Notifications"
                  isOpen={isNotificationDropdownOpen}
                  onClose={() => setIsNotificationDropdownOpen(false)}
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() =>
                    setIsMessagesDropDownOpen(!isMessagesDropDownOpen)
                  }
                  className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  notificationType="Messages"
                  isOpen={isMessagesDropDownOpen}
                  onClose={() => setIsMessagesDropDownOpen(false)}
                  notifications={messages}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              {/* <MessageCircle className={`w-3 h-3 sm:w-5 sm:h-5 hover:text-green-500 text-gray-600`} />
              <Heart className={`w-3 h-3 sm:w-5 sm:h-5 hover:text-green-500 text-gray-600`} /> */}
            </div>

            {/* show when user is not logged in */}
            {session && session.userName ? (
              <div className={`hidden md:flex items-center space-x-4`}>
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      <img className="rounded-full" src={session.profile ?? ''} alt={session.userName} />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {session.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.role}
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {session.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.email}
                        </div>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        onClick={closeAllMenus}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={closeAllMenus}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          href="/"
                          onClick={closeAllMenus}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Home className="w-4 h-4" />
                          <span>Back to Website</span>
                        </Link>

                        <button
                          onClick={() => {
                            closeAllMenus();
                            // Handle logout
                            console.log("Logging out...");
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`hidden ${sessionParam ? "" : "md:flex"} items-center space-x-4`}
              >
                <Link
                  href={"/auth/login"}
                  className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors font-bold"
                >
                  Login
                </Link>
                <Link
                  href={"/auth/signup"}
                  className="font-bold bg-green-600 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Filters Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
  );
}
