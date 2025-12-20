"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileChatLayout from "./MobileChatLayout";
import ConversationList from "./ConversationList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatEmptyState from "./ChatEmptyState";
import { Conversation, Message, User } from "@/lib/types/messages/types";
import { mockMessages } from "@/data/dashboard/messages";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { ContentLoader, LoadingSpinner } from "../Loading";

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUser: User;
  hasNextConversations: boolean;
  fetchNextConversationsPage: () => void;
  isFetchingNextConversationPage: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isConversationLoading: boolean;
}

const Message_PAGE_SIZE = 50;

export default function ChatLayout({
  conversations,
  currentUser,
  hasNextConversations,
  fetchNextConversationsPage,
  isFetchingNextConversationPage,
  searchQuery,
  setSearchQuery,
  isConversationLoading,
}: ChatLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  //------------ Fetching Messages ------------------

  // fetchMessage from backend
  const fetchMessages = useCallback(
    async ({ pageParam = 1 }): Promise<Message[]> => {
      console.log("selected user: ", selectedConversation);
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: Message_PAGE_SIZE.toString(),
      });

      try {
        const res = await authFetch(
          `${BACKEND_URL}/chat/messages/${selectedConversation?.id}?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const result = await res.json();
        console.log("Messages recieved: ", result);
        return result;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [selectedConversation]
  );

  // infinite query
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isMessagesLoading,
  } = useInfiniteQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: fetchMessages,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 30 ? undefined : allPages.length + 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const msgs = useMemo(() => data?.pages[0].flat() ?? [], [data]);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  // Use MobileChatLayout for mobile devices
  if (isMobile) {
    return (
      <MobileChatLayout
        conversations={conversations}
        currentUser={currentUser}
      />
    );
  }

  // Desktop Layout
  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedConversation.participant.id,
      content,
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleReplyToMessage = (messageId: string) => {
    console.log("Reply to message:", messageId);
  };

  const handleCall = () => {
    console.log("Initiate voice call");
  };

  const handleVideoCall = () => {
    console.log("Initiate video call");
  };

  const handleMenuClick = () => {
    console.log("Open chat menu");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Conversation List Sidebar */}
      <div className="w-80 lg:w-96 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
          showReturnToWebsite={true}
          fetchNextConversationsPage={fetchNextConversationsPage}
          hasNextConversations={hasNextConversations}
          isFetchingNextConversationPage={isFetchingNextConversationPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isConversationLoading={isConversationLoading}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              user={selectedConversation.participant}
              onCall={handleCall}
              onVideoCall={handleVideoCall}
              onMenuClick={handleMenuClick}
              showBackButton={false}
              showReturnToWebsite={true}
            />

            {isMessagesLoading ? (
              <div className=" flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                <LoadingSpinner size="small" />
                <p className="text-gray-400 text-xl">Loading Messages</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <ChatEmptyState title="No Messages Yet" description="Send first message to start conversation" />
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUser.id}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReplyToMessage={handleReplyToMessage}
              />
            )}

            <MessageInput
              onSendMessage={handleSendMessage}
              placeholder={`Message ${selectedConversation.participant.name}...`}
            />
          </>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}
