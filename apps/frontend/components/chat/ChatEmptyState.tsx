"use client";

import { MessageCircle } from "lucide-react";

interface ChatEmptyStateProps {
  title?: string;
  description?: string;
}

export default function ChatEmptyState({
  title = "No conversation selected",
  description = "Choose a conversation from the list to start chatting"
}: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="text-center max-w-md">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}