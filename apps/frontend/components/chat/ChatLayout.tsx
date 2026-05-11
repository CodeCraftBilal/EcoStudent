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
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { LoadingSpinner } from "../Loading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/context/useSocket";
import OrderSidebar from "./OrderSidebar";
import { useSession } from "@/context/useSession";
import { SOCKET_EVENTS } from "@/lib/socket-events";

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
  conversations: conversationProp,
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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { session } = useSession();
  const { socket } = useSocket();

  const conversationIdFromUrl = searchParams.get("conversationId");
  const isNewChat = searchParams.get("newChat") === "true";

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newlyCreatedChat, setNewlyCreatedChat] = useState<Conversation | null>(
    null,
  );
  const [isFetchingNewChat, setIsFetchingNewChat] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(
    () => conversationProp,
  );

  useEffect(() => {
    setConversations((prev) => {
      // Merge conversationProp with newlyCreatedChat
      const updated = [...conversationProp];
      if (newlyCreatedChat) {
        const exists = updated.some((c) => c.id === newlyCreatedChat.id);
        if (!exists) {
          updated.unshift(newlyCreatedChat);
        }
      }
      return updated;
    });
  }, [conversationProp, newlyCreatedChat]);

  // Fetch the newly created chat when redirected with newChat flag
  useEffect(() => {
    const fetchNewChat = async () => {
      if (conversationIdFromUrl && isNewChat && !newlyCreatedChat) {
        try {
          setIsFetchingNewChat(true);
          const response = await authFetch(
            `${BACKEND_URL}/chat/${conversationIdFromUrl}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch new chat");
          }

          const chatData = await response.json();
          console.log("Fetched new chat:", chatData);
          setNewlyCreatedChat(chatData);
          
          // Invalidate conversations to ensure the query cache is fully up to date
          queryClient.invalidateQueries({ queryKey: ["conversations"] });

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

  // Handled by the merged effect above

  // Handle URL parameter to select conversation
  useEffect(() => {
    if (!conversationIdFromUrl || conversations.length === 0) return;

    const foundConversation = conversations.find(
      (conv) =>
        conv.id.toString() === conversationIdFromUrl ||
        Number(conv.id) === Number(conversationIdFromUrl)
    );

    if (!foundConversation) {
      if (selectedConversationId !== null) {
        setSelectedConversationId(null);
      }
      return;
    }

    const nextId = foundConversation.id.toString();

    // 🔥 THIS LINE PREVENTS THE LOOP
    if (selectedConversationId !== nextId) {
      setSelectedConversationId(nextId);
    }
  }, [conversationIdFromUrl, conversations, selectedConversationId]);


  // Handle manual conversation selection (update URL)
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", conversationId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const selectedConversation = conversations.find(
    (conv) => conv.id.toString() === selectedConversationId,
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
          },
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const result = await res.json();
        console.log("unsorted messages: ", result);
        return result;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [selectedConversation],
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

  // read recipent
  const handleMarkAllAsRead = () => {
    console.log("marking all as read");
    if (!socket || !selectedConversation) {
      console.log("no socket or selted conversatoin");
      return;
    }

    socket.emit(SOCKET_EVENTS.MESSAGE.READ, {
      chatId: selectedConversation.id,
    });

    console.log('making unread messages of chat: ', selectedConversation.id, ' to 0');
    setConversations(prev =>
      prev.map((con) =>
        con.id == selectedConversation.id
          ? { ...con, unreadCount: 0 }
          : con
      )
    );
  };

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

      setConversations((prev) =>
        prev.map((con) =>
          con.id === selectedConversation.id
            ? { ...selectedConversation, lastMessage: content }
            : con
        )
      )

      moveConversationToTop(selectedConversation.id);
    } catch (err) {
      console.log("Socket not initialized: ", err);
    }
  };

  const moveConversationToTop = (convId: string) => {
    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id.toString() === convId);
      if (index === -1) return prev;

      const updated = [...prev];
      const [item] = updated.splice(index, 1);
      updated.unshift(item);

      return updated;
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("message:receive", handleIncomingMessage);

    socket.on(SOCKET_EVENTS.MESSAGE.READ, handleRead);
    return () => {
      socket.off("message:receive", handleIncomingMessage);
    };
  }, [socket, selectedConversationId]);

  const handleIncomingMessage = async (message: Message) => {
    console.log("Received message via socket:", message);

    const isExisting = conversations.some(c => c.id.toString() === message.chatId.toString());

    if (!isExisting) {
      try {
        const response = await authFetch(`${BACKEND_URL}/chat/${message.chatId}`);
        if (response.ok) {
          const newChat = await response.json();
          setConversations(prev => {
            if (prev.some(c => c.id.toString() === message.chatId.toString())) return prev;
            return [newChat, ...prev];
          });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      } catch (err) {
        console.error("Failed to fetch new conversation", err);
      }
    } else {
      // move conversation to top
      moveConversationToTop(message.chatId.toString());

      setConversations((prev) =>
        prev.map((con) =>
          con.id.toString() === message.chatId.toString()
            ? { ...con, lastMessage: message.content, unreadCount: Number(con.unreadCount || 0) + 1 }
            : con
        )
      )
    }

    // ignore messages from other conversations
    if (message.chatId.toString() !== selectedConversationId) {
      console.log("Ignored message for chatId:", typeof message.chatId);
      console.log(
        "Current selected conversationId:",
        typeof selectedConversationId,
      );
      return;
    }

    setMessages((prev) => [...prev, message]);
  };

  const handleRead = (data: { chatId: string }) => {
    console.log("marking all read from socket ", data);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.chatId === Number(data.chatId) && msg.status !== "read"
          ? { ...msg, status: "read" }
          : msg,
      ),
    );
  };

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Use MobileChatLayout for mobile devices
  if (isMobile) {
    return (
      <MobileChatLayout
        conversations={conversations}
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
        markAllAsRead={handleMarkAllAsRead}
      />
    );
  }

  // Desktop Layout

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true }
          : msg,
      ),
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
                markAllAsRead={handleMarkAllAsRead}
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
        {selectedConversation && currentUser && (
          <OrderSidebar
            conversationId={selectedConversationId || undefined}
            selectedConversation={selectedConversation}
            productId={Number(selectedConversation.item?.id)}
            currentUser={{ id: Number(session?.userId), role: session?.role }}
            isOwner={
              Number(currentUser.id) ===
              Number(selectedConversation.item?.sellerId)
            } // Adjust based on your logic
          />
        )}
      </div>
    </div>
  );
}
