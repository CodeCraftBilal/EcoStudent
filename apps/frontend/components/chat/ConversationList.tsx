"use client";

import { useState } from "react";
import { Search, Home } from "lucide-react";
import Link from "next/link";
import { Conversation } from "@/lib/types/messages/types";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  showReturnToWebsite?: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onConversationSelect,
  showReturnToWebsite = true
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.item?.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Chats</h2>
          {showReturnToWebsite && (
            <Link 
              href="/"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">Return to Website</span>
            </Link>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <Search className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-center">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            {!searchQuery && (
              <Link
                href="/shop"
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Start shopping to begin conversations
              </Link>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              showItemInfo={true}
            />
          ))
        )}
      </div>
    </div>
  );
}