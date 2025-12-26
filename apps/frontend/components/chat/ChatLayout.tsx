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
import { useInfiniteQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { LoadingSpinner } from "../Loading";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useSocket } from "@/context/useSocket";
import OrderSidebar from "./OrderSidebar";
import { useSession } from "@/context/useSession";

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUser: User;
  hasNextConversations: boolean;
  fetchNextConversationsPage: () => void;
  isFetchingNextConversationPage: boolean;
  isConversationLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { session } = useSession()
  const socket = useSocket();

  const conversationIdFromUrl = searchParams.get("conversationId");
  const isNewChat = searchParams.get("newChat") === "true";

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newlyCreatedChat, setNewlyCreatedChat] = useState<Conversation | null>(
    null
  );
  const [isFetchingNewChat, setIsFetchingNewChat] = useState(false);

  // Fetch the newly created chat when redirected with newChat flag
  useEffect(() => {
    const fetchNewChat = async () => {
      if (conversationIdFromUrl && isNewChat && !newlyCreatedChat) {
        try {
          setIsFetchingNewChat(true);
          const response = await authFetch(
            `${BACKEND_URL}/chat/${conversationIdFromUrl}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch new chat");
          }

          const chatData = await response.json();
          console.log("Fetched new chat:", chatData);
          setNewlyCreatedChat(chatData);

          // Remove newChat flag from URL but keep conversationId
          const params = new URLSearchParams(searchParams.toString());
          params.delete("newChat");
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (error) {
          console.error("Error fetching new chat:", error);
        } finally {
          setIsFetchingNewChat(false);
        }
      }
    };

    fetchNewChat();
  }, [conversationIdFromUrl, isNewChat, searchParams, pathname, router]);

  // Merge conversations with newly created chat and sort
  const allConversations = useMemo(() => {
    // Start with conversations from props
    const merged = [...conversations];

    // Add newly created chat if it exists and isn't already in the list
    if (
      newlyCreatedChat &&
      !merged.some((conv) => conv.id === newlyCreatedChat.id)
    ) {
      // Insert at the beginning since it's the newest
      merged.unshift(newlyCreatedChat);
    } else if (newlyCreatedChat) {
      // If it's already in the list, move it to the top
      const index = merged.findIndex((conv) => conv.id === newlyCreatedChat.id);
      if (index > -1) {
        const [existingChat] = merged.splice(index, 1);
        merged.unshift(existingChat);
      }
    }

    // Sort by lastMessageAt (newest first)
    return merged.sort((a, b) => {
      const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [conversations, newlyCreatedChat]);

  // Handle URL parameter to select conversation
  useEffect(() => {
    if (conversationIdFromUrl && allConversations.length > 0) {
      console.log("Looking for conversation with ID:", conversationIdFromUrl);
      console.log(
        "Available conversations:",
        allConversations.map((c) => c.id)
      );

      const foundConversation = allConversations.find(
        (conv) =>
          conv.id.toString() === conversationIdFromUrl ||
          Number(conv.id) === Number(conversationIdFromUrl)
      );

      if (foundConversation) {
        console.log("Found! Setting conversation ID:", foundConversation.id);
        setSelectedConversationId(foundConversation.id.toString());
      } else {
        console.warn("Conversation not found");
        setSelectedConversationId(null);
      }
    }
  }, [conversationIdFromUrl, allConversations]);

  // Handle manual conversation selection (update URL)
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", conversationId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const selectedConversation = allConversations.find(
    (conv) => conv.id.toString() === selectedConversationId
  );

  //------------ Fetching Messages ------------------
  const fetchMessages = useCallback(
    async ({ pageParam = 1 }): Promise<Message[]> => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: Message_PAGE_SIZE.toString(),
      });

      try {
        if (!selectedConversation?.id)
          throw new Error("No conversation selected");
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
        console.log("Messages received: ", result);
        return result;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [selectedConversation]
  );

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
      lastPage.length < 50 ? undefined : allPages.length + 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const msgs = useMemo(() => data?.pages.flat() ?? [], [data]);

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  const handleSendMessage = (content: string) => {
    console.log("sending message ", content);
    try {
      if (!selectedConversation || !socket)
        throw new Error("Socket does not initialize");

      const payload = {
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        receiverId: selectedConversation.participant.id,
        content,
        type: "text",
      };

      // EMIT EVENT TO BACKEND
      socket.emit("message:send", {
        data: {
          chatId: Number(selectedConversation.id),
          receiverId: payload.receiverId,
          messageType: "TEXT",
          content: payload.content,
        },
      });

      // optimistic UI update
      const optimisticMessage: Message = {
        id: Date.now().toString(),
        chatId: Number(selectedConversation.id),
        senderId: currentUser.id,
        receiverId: selectedConversation.participant.id,
        content,
        timestamp: new Date().toISOString(),
        type: "text",
        status: "sent",
      };

      setMessages((prev) => [...prev, optimisticMessage]);
    } catch (err) {
      console.log("Socket not initialized: ", err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message: Message) => {
      console.log("Received message via socket:", message);
      // ignore messages from other conversations
      if (message.chatId.toString() !== selectedConversationId) {
        console.log("Ignored message for chatId:", typeof message.chatId);
        console.log(
          "Current selected conversationId:",
          typeof selectedConversationId
        );
        return;
      }

      setMessages((prev) => [...prev, message]);
    };

    socket.on("message:receive", handleIncomingMessage);

    return () => {
      socket.off("message:new", handleIncomingMessage);
    };
  }, [socket, selectedConversationId]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Use MobileChatLayout for mobile devices
  if (isMobile) {
    return (
      <MobileChatLayout
        conversations={allConversations}
        currentUser={currentUser}
        onConversationSelect={handleConversationSelect}
        // conversation props
        fetchNextConversationsPage={fetchNextConversationsPage}
        hasNextConversations={hasNextConversations}
        isFetchingNextConversationPage={
          isFetchingNextConversationPage || isFetchingNewChat
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isConversationLoading={isConversationLoading || isFetchingNewChat}
        // messages props
        msgs={messages}
        fetchNextMsgPage={fetchNextPage}
        hasNextMsgPage={hasNextPage}
        isFetchingNextMsgPage={isFetchingNextPage}
        isLoadingMessages={isMessagesLoading}
        // input props
        onMsgSend={handleSendMessage}
      />
    );
  }

  // Desktop Layout

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
          conversations={allConversations}
          selectedConversationId={selectedConversationId}
          onConversationSelect={handleConversationSelect}
          showReturnToWebsite={true}
          fetchNextConversationsPage={fetchNextConversationsPage}
          hasNextConversations={hasNextConversations}
          isFetchingNextConversationPage={
            isFetchingNextConversationPage || isFetchingNewChat
          }
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isConversationLoading={isConversationLoading || isFetchingNewChat}
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
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                  <LoadingSpinner size="small" />
                  <p className="text-gray-400 text-xl">Loading Messages</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <ChatEmptyState
                title="No Messages Yet"
                description="Send first message to start conversation"
              />
            ) : (
              <MessageList
                messages={messages}
                currentUserId={currentUser.id}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onReplyToMessage={handleReplyToMessage}
                hasNextMsgPage={hasNextPage}
                fetchNextMsgPage={fetchNextPage}
                isFetchingNextMsgPage={isFetchingNextPage}
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

        {/* Placeholder for Order Sidebar */}
      <div className="w-80 lg:w-96 border-l border-gray-200">
        {selectedConversation && (
          <OrderSidebar
            conversationId={selectedConversationId || undefined}
            productId={Number(selectedConversation.item?.id)}
            currentUser={{id: Number(session?.userId), role: session?.role}}
            isOwner={Number(currentUser.id) === Number(selectedConversation.item?.sellerId)} // Adjust based on your logic
          />
        )}
      </div>
    </div>
  );
}
