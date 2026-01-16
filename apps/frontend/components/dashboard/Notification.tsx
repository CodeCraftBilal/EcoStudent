"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { Bell, MessageCircle, ShoppingBag, Star, Package, Check, Settings } from "lucide-react";
import Link from "next/link";
import { Notification } from "@/lib/types/types";

// interface Notification {
//   id: string;
//   type: 'message' | 'sale' | 'review' | 'system' | 'warning';
//   title: string;
//   message: string;
//   time: string;
//   read: boolean;
//   link?: string;
// }

interface NotificationDropdownProps {
  notificationType: 'Messages' | 'Notifications';
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  notificationCount: number;
}

export default function NotificationDropdown({
  notificationType,
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  notificationCount
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'sale':
        return <ShoppingBag className="w-4 h-4 text-green-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'warning':
        return <Package className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{notificationType}</h3>
        <div className="flex items-center space-x-2">
          {notificationCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-eco-600 hover:text-eco-700 font-medium"
            >
              Mark all as read
            </button>
          )}
          <Link
            href="/dashboard/notifications"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-gray-100 last:border-0 ${
                notification.read ? 'bg-white' : 'bg-eco-50'
              }`}
            >
              {notification.link ? (
                <Link
                  href={notification.link}
                  onClick={() => onMarkAsRead(notification.id)}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <NotificationItem 
                    notification={notification} 
                    getNotificationIcon={getNotificationIcon}
                    formatTime={formatTime}
                  />
                </Link>
              ) : (
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <NotificationItem 
                    notification={notification} 
                    getNotificationIcon={getNotificationIcon}
                    formatTime={formatTime}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <Link
          href="/dashboard/chat"
          className="block text-center text-sm text-eco-600 hover:text-eco-700 font-medium py-2"
        >
          View all {notificationType.toLowerCase()}
        </Link>
      </div>
    </div>
  );
}

// Separate component for notification item for better readability
function NotificationItem({ 
  notification, 
  getNotificationIcon, 
  formatTime 
}: { 
  notification: Notification;
  getNotificationIcon: (type: string) => JSX.Element;
  formatTime: (timestamp: string) => string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              notification.read ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
          
          {!notification.read && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-2 h-2 bg-eco-500 rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {formatTime(notification.time)}
          </span>
          
          {!notification.read && (
            <button className="text-xs text-eco-600 hover:text-eco-700 font-medium">
              <Check className="w-3 h-3 inline mr-1" />
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}