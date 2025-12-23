"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Home } from "lucide-react";
import Link from "next/link";
import { Conversation } from "@/lib/types/messages/types";
import ConversationItem from "./ConversationItem";
import { ContentLoader, SkeletonCard } from "../Loading";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  showReturnToWebsite?: boolean;
  hasNextConversations: boolean;
  fetchNextConversationsPage: () => void;
  isFetchingNextConversationPage: boolean;
  searchQuery?: string;
  setSearchQuery: (query: string) => void;
  isConversationLoading: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onConversationSelect,
  showReturnToWebsite = true,
  hasNextConversations,
  fetchNextConversationsPage,
  isFetchingNextConversationPage,
  searchQuery,
  setSearchQuery,
  isConversationLoading,
}: ConversationListProps) {
  // intersection observer
  const lastItemRef = useRef<HTMLDivElement | null>(null);
console.log('selected con: ', selectedConversationId)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextConversationsPage();
      }
    });

    if (lastItemRef.current) observer.observe(lastItemRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    hasNextConversations,
    isFetchingNextConversationPage,
    fetchNextConversationsPage,
  ]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Chats</h2>
          {showReturnToWebsite && (
            <Link
              href="/shop"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">
                Return to Shop
              </span>
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

      {/* Loading Anim */}
      {isConversationLoading && (
        <div>
          <ContentLoader count={4} type="list" />
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {!isConversationLoading && conversations.length === 0 ? (
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
          conversations.map((conversation, index) => {
            const isLast = conversations.length - 1 === index;
            return (
              <div key={conversation.id} ref={isLast ? lastItemRef : null}>
                <ConversationItem
                  conversation={conversation}
                  isSelected={selectedConversationId === conversation.id.toString()}
                  onClick={() => onConversationSelect(conversation.id)}
                  showItemInfo={true}
                />
              </div>
            );
          })
        )}
        {isFetchingNextConversationPage && (
          <div className="p-4 text-center text-gray-500">
            <ContentLoader count={4} type="list" />
          </div>
        )}
      </div>
    </div>
  );
}
