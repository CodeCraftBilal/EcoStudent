"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/lib/types/messages/types";
import MessageItem from "./MessageItem";
import { LoadingSpinner } from "../Loading";

interface MessageListProps {
  messages: Message[];
  currentUserId: string | null;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (messageId: string) => void;
  hasNextMsgPage: boolean;
  fetchNextMsgPage: () => void;
  isFetchingNextMsgPage: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  onReplyToMessage,
  hasNextMsgPage,
  fetchNextMsgPage,
  isFetchingNextMsgPage,
}: MessageListProps) {
  console.log('message: ', messages)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Sort messages by timestamp descending (newest first for display)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    setShouldScrollToBottom(isAtBottom);
  };

  // Intersection observer for loading more messages when scrolling to top
  const firstItemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextMsgPage && !isFetchingNextMsgPage) {
        fetchNextMsgPage();
        // When loading older messages, don't auto-scroll
        setShouldScrollToBottom(false);
      }
    });

    if (firstItemRef.current) observer.observe(firstItemRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextMsgPage, isFetchingNextMsgPage, fetchNextMsgPage]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col-reverse bg-gradient-to-br from-eco-100 to-eco-blue-100"
      onScroll={handleScroll}
    >
      {/* Invisible div at the bottom for scrolling */}
      <div ref={messagesEndRef} />
      
      {/* Messages in reverse order */}
      {sortedMessages.map((message, index) => {
        const messageDate = new Date(message.timestamp).toDateString();
        const nextMessageDate = index < sortedMessages.length - 1 
          ? new Date(sortedMessages[index + 1].timestamp).toDateString() 
          : null;
        const showDateSeparator = messageDate !== nextMessageDate;
        const isLast = index === sortedMessages.length -1;
        return (
          <div key={message.id}>
            {/* Message */}
            <div ref={isLast ? firstItemRef : null}>
              <MessageItem
                message={message}
                isOwnMessage={message.senderId === currentUserId}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                onReply={onReplyToMessage}
              />
            </div>

            {/* Date Separator - appears above the oldest message of that date */}
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="bg-white border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                  {new Date(messageDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {isFetchingNextMsgPage && <LoadingSpinner size="small" />}
    </div>
  );
}