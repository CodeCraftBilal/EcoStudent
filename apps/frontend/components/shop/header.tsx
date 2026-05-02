"use client";

import { Search, Filter, Leaf, Bell, MessageCircle } from "lucide-react";
import { Filters, FiltersProps } from "./filters";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/context/useSession";
import NotificationDropdown from "../dashboard/Notification";
import Image from "next/image";
import ProfileDropDown from "../dashboard/ProfileDropDown";
import { useNotification } from "@/context/useNotification";
import { useRef } from "react";
import SearchHistoryDropdown from "./SearchHistoryDropdown";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

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

  const { session, isLoading } = useSession();

  const {
    notifications,
    messageNotifications,
    unreadNotificationCount,
    unreadMessageCount,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isMessagesDropDownOpen, setIsMessagesDropDownOpen] = useState(false);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = async (query: string) => {
    if (!query.trim() || !session) return;
    try {
      await authFetch(`${BACKEND_URL}/search-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
    } catch (error) {
      console.error("Failed to save search history", error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-3 md:py-0 md:h-16 gap-y-3">
          <Link
            href={"/"}
            className="flex items-center space-x-1 order-1"
          >
            <Image src={"/logo.png"} alt="EcoStudent" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">EcoStudent</h1>
          </Link>

          {/* Search Bar in Header */}
          <div className="flex items-center justify-center gap-3 w-full md:flex-1 md:max-w-2xl md:mx-4 order-3 md:order-2">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for books, uniforms, calculators..."
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(searchQuery);
                    setIsSearchDropdownOpen(false);
                  }
                }}
                className="w-full text-black pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <div className="flex justify-end mb-4 sm:hidden"></div>
              <SearchHistoryDropdown
                searchQuery={searchQuery}
                isOpen={isSearchDropdownOpen}
                setIsOpen={setIsSearchDropdownOpen}
                onSelectSearch={(query) => {
                  setSearchQuery(query);
                  handleSearchSubmit(query);
                }}
                inputRef={searchInputRef}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg shrink-0"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 order-2 md:order-3">
            {/* show when user is login in */}
            <div
              className={`${session && session.userName ? "flex" : "hidden"} gap-2 md:gap-4 items-center justify-center`}
            >
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                  }
                  className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  notificationType="Notifications"
                  isOpen={isNotificationDropdownOpen}
                  onClose={() => setIsNotificationDropdownOpen(false)}
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  notificationCount={unreadNotificationCount}
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
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessageCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  notificationType="Messages"
                  isOpen={isMessagesDropDownOpen}
                  onClose={() => setIsMessagesDropDownOpen(false)}
                  notifications={messageNotifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  notificationCount={unreadMessageCount}
                />
              </div>
            </div>

            {/* show when user is not logged in */}
            {session && session.userName ? (
              <div className={`flex items-center space-x-4`}>
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 px-0 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm relative">
                      {session.profile ? (
                        <Image
                          fill
                          className="rounded-full object-center object-cover"
                          src={session.profile}
                          alt={session.userName}
                        />
                      ) : (
                        <div className="flex items-center justify-center rounded-full w-8 h-8">
                          <p>{session.userName[0].toUpperCase()}</p>
                        </div>
                      )}
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
                    <ProfileDropDown closeAllMenus={closeAllMenus} />
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`${session ? "" : "flex"} items-center space-x-2 md:space-x-4`}
              >
                <Link
                  href={"/auth/signin"}
                  className="text-gray-700 cursor-pointer hover:text-green-600 transition-colors font-bold text-sm md:text-base"
                >
                  Signin
                </Link>
                <Link
                  href={"/auth/signup"}
                  className={`${session ? "" : "block"} font-bold bg-green-600 cursor-pointer text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-green-700 transition-colors shadow-lg text-sm md:text-base whitespace-nowrap`}
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
