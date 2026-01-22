"use client";

import { ChatLayout } from "@/components/chat";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { Conversation, User } from "@/lib/types/messages/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";

type ApiResponse = {
  conversations: Conversation[];
  currentUser: User | null;
};

const PAGE_SIZE = 30;

function ChatPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchConversations = useCallback(
    async ({ pageParam = 0 }): Promise<ApiResponse> => {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        page: pageParam.toString(),
      });
      params.append(`searchQuery`, debouncedSearch);

      console.log('params ', params.toString())
      try {
        const response = await authFetch(
          `${BACKEND_URL}/chat/conversations?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
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
    [debouncedSearch]
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
    () =>
      data
        ? data.pages.flatMap((page) => page.conversations)
        : [],
    [data]
  );

  const currentUser = data?.pages[0]?.currentUser as User;

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
