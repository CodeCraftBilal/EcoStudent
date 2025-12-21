"use client";

import { useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, Message[]>
  );

  // intersection observer
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((enteries) => {
      if (enteries[0].isIntersecting) {
        fetchNextMsgPage();
      }
    });

    if (lastItemRef.current) observer.observe(lastItemRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextMsgPage, isFetchingNextMsgPage, fetchNextMsgPage, messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex justify-center my-4">
            <span className="bg-white border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Messages */}
          {dateMessages.map((message, index) => {
            const isFirst = index === 0;
            return (
              <div key={message.id} ref={isFirst ? lastItemRef : null}>
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === currentUserId}
                  onEdit={onEditMessage}
                  onDelete={onDeleteMessage}
                  onReply={onReplyToMessage}
                />
              </div>
            );
          })}

          {isFetchingNextMsgPage && <LoadingSpinner size="small" />}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
