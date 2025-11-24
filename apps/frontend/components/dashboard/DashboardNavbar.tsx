"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  Menu,
  X,
  Home,
  Package,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import NotificationDropdown from "./Notification";
import UploadItemModal from "./UploadItemModal";
import { UploadItemData } from "@/lib/types/dashboard/types";
import { useSession } from "@/context/useSession";
import { BACKEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";


// mock notifications
export const notificationsData = [
    {
      id: "1",
      type: "message" as const,
      title: "New Message",
      message: "Ali sent you a message about the Calculus book",
      time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      read: false,
      link: "/chat",
    },
    {
      id: "2",
      type: "sale" as const,
      title: "Item Sold",
      message: "Your Scientific Calculator has been sold",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      link: "/dashboard/listings",
    },
    {
      id: "3",
      type: "review" as const,
      title: "New Review",
      message: "Sara gave you 5 stars for the uniform",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      link: "/dashboard/reviews",
    },
  ]

export default function DashboardNavbar() {

  // fetching session
  const {session, refreshSession} = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const pathname = usePathname();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    refreshSession();
}, [])

  const dashboardLinks = [
    {
      name: "My Listings",
      href: "/dashboard/listings",
      // icon: Package,
      description: "Manage items",
    },
    {
      name: "Messages",
      href: "/dashboard/chat",
      // icon: MessageCircle,
      description: "Chats",
    },
    {
      name: "Favorites",
      href: "/dashboard/favorites",
      // icon: User,
      description: "Account settings",
    },
    {
      name: 'Purchases',
      href: '/dashboard/purchases',
      descrption: 'View items you bought'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  //
  const [notifications, setNotifications] = useState(notificationsData);

  // Notification handlers
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

  const handleLogout = async () => {
    const res = await authFetch(`${BACKEND_URL}/auth/signout`, {
      method: 'Get'
    });

    if(!res.ok) {
      console.log(`server res: ${res.status} ${res.statusText}`)
      return;
    }
    const result = await res.json()
    console.log(result);
    console.log('logout succfull', result)
    redirect('/auth/signin');
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">
                  EcoStudent
                </span>
                <span className="text-xs text-green-600 font-medium block -mt-1">
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {dashboardLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    {/* <link.icon className="w-4 h-4" /> */}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section - Search, Actions, Profile */}
          <div className="flex items-center space-x-4">

            {/*Quick Action Button */}
            <button
              onClick={() => {
                setIsUploadModalOpen(!isUploadModalOpen)
              }}
              className="hidden sm:flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Sell Item</span>
            </button>
            
            <Link
              href={'/shop'}
              className="hidden sm:flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
            >
              <ShoppingBasket className="w-4 h-4" />
              <span className="font-medium">Explore Items</span>
            </Link>

            <UploadItemModal
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              setIsUploadModalOpen={setIsUploadModalOpen}
            />

            {/* Notifications */}
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

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                 {session?.profile ? <img
                  className="rounded-full"
                  src={session?.profile} alt={session?.userName} /> : <span>E</span>}
                  
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {session?.userName}
                  </div>
                  <div className="text-xs text-gray-500">{session?.role}</div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {session?.userName}
                    </div>
                    <div className="text-xs text-gray-500">{session?.email}</div>
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
                        handleLogout();
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {dashboardLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeAllMenus}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    {/* <link.icon className="w-5 h-5" /> */}
                    <div>
                      <div className="font-medium">{link.name}</div>
                      <div className="text-sm text-gray-500">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Action Button (Mobile) */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/dashboard/upload"
                onClick={closeAllMenus}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-colors shadow-sm w-full"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Sell an Item</span>
              </Link>
            </div>

            {/* Mobile Additional Links */}
            <div className="mt-4 space-y-2">
              <Link
                href="/"
                onClick={closeAllMenus}
                className="flex items-center space-x-3 p-3 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Website</span>
              </Link>

              <button
                onClick={() => {
                  closeAllMenus();
                  console.log("Logging out...");
                }}
                className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for closing dropdowns */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

