"use client";

import { motion } from "framer-motion";
import { Clock, Check, CheckCheck, Star, Verified } from "lucide-react";
import { Conversation } from "@/lib/types/messages/types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  showItemInfo?: boolean;
}

export default function ConversationItem({
  conversation,
  isSelected,
  onClick,
  showItemInfo = true
}: ConversationItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors
    ${isSelected 
      ? "bg-eco-50 border-r-4 border-r-eco-500 shadow-sm" 
      : "hover:bg-eco-50/50"
    }`}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={conversation.participant.avatar}
            alt={conversation.participant.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {conversation.participant.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.participant.name}
              </h3>
              {conversation.participant.verified && (
                <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatTime(conversation.lastMessageAt)}</span>
            </div>
          </div>

          {/* Last Message Preview */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 truncate flex-1 mr-2">
              {conversation.lastMessage}
            </p>
            
            {/* Unread Badge */}
            {conversation.unreadCount > 0 && (
              <span className="bg-eco-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          {/* Seller Rating */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{conversation.participant.rating}</span>
            </div>
            <span>•</span>
            <span className={conversation.participant.isOnline ? "text-green-500" : "text-gray-500"}>
              {conversation.participant.isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* Item Info */}
          {showItemInfo && conversation.item && (
            <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
              <img
                src={conversation.item.image}
                alt={conversation.item.title}
                className="w-6 h-6 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {conversation.item.title}
                </p>
                <p className="text-xs text-eco-600 font-semibold">
                  Rs {conversation.item.price.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}