"use client";

import { ChatLayout } from "@/components/chat";
import { useSocket } from "@/context/useSocket";
import { authFetch } from "@/lib/authFetch";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { BACKEND_URL } from "@/lib/types/constants";
import { Conversation, User } from "@/lib/types/messages/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";

type ApiResponse = {
  conversations: Conversation[];
  currentUser: User | null;
};

const PAGE_SIZE = 30;

function ChatPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const fetchConversations = useCallback(
    async ({ pageParam = 0 }): Promise<ApiResponse> => {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        page: pageParam.toString(),
      });
      params.append(`searchQuery`, debouncedSearch);

      console.log("params ", params.toString());
      try {
        const response = await authFetch(
          `${BACKEND_URL}/chat/conversations?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        console.log("Fetched conversations:", data);
        return data;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        return { conversations: [], currentUser: null };
      }
    },
    [debouncedSearch],
  );

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchQuery]);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["conversations", debouncedSearch],
      queryFn: fetchConversations,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.conversations.length < 30 ? undefined : allPages.length + 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const allConversations = useMemo(
    () => (data ? data.pages.flatMap((page) => page.conversations) : []),
    [data],
  );

  const currentUser = data?.pages[0]?.currentUser as User;

  useEffect(() => {
    if (!isConnected || !socket) return;
    socket.on(SOCKET_EVENTS.USER.USER_ONLINE, markUserOnline);
    socket.on(SOCKET_EVENTS.USER.USER_OFFLINE, markUserOffline);

    return () => {
      socket.off(SOCKET_EVENTS.USER.USER_ONLINE, markUserOnline);
      socket.off(SOCKET_EVENTS.USER.USER_OFFLINE, markUserOffline);
    };
  }, [socket, isConnected]);

  const markUserOnline = (payload: any) => {
    console.log("marking user online ", typeof payload.userId);
    queryClient.setQueryData(
      ["conversations", debouncedSearch],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            conversations: page.conversations.map((con: Conversation) =>
              con.participant.id === payload.userId
                ? {
                    ...con,
                    participant: {
                      ...con.participant,
                      isOnline: true,
                    },
                  }
                : con,
            ),
          })),
        };
      },
    );
  };

  const markUserOffline = (payload: any) => {
    console.log("marking user offline ", typeof payload);
    queryClient.setQueryData(
      ["conversations", debouncedSearch],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            conversations: page.conversations.map((con: Conversation) =>
              con.participant.id === payload.userId
                ? {
                    ...con,
                    participant: {
                      ...con.participant,
                      isOnline: false,
                    },
                  }
                : con,
            ),
          })),
        };
      },
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-white">
      <ChatLayout
        conversations={allConversations}
        hasNextConversations={hasNextPage}
        fetchNextConversationsPage={fetchNextPage}
        isFetchingNextConversationPage={isFetchingNextPage}
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isConversationLoading={isLoading}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
