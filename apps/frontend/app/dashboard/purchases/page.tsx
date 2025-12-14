"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  PurchaseStats,
  PurchaseFilters,
  PurchaseList,
  EmptyPurchases,
  PurchaseItem,
} from "@/components/dashboard/purchase/index";
import {
  Purchase,
  PurchaseStats as PurchaseStatsType,
} from "@/lib/types/dashboard/purchase/purchase";
import { mockPurchasesData } from "@/data/dashboard/purchases";
import { useSession } from "@/context/useSession";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { param } from "framer-motion/client";
import { AnimatePresence, motion } from "framer-motion";
import { ContentLoader } from "@/components/Loading";

const PAGE_SIZE = 12;

type ApiResponse = {
  data: Purchase[];
  purchaseStats: PurchaseStatsType;
};

export default function PurchasesPage() {
  // const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { isLoading, session } = useSession();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // fetch Purchases
  const fetchPurchases = useCallback(
    async ({ pageParam = 1 }): Promise<ApiResponse> => {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(PAGE_SIZE),
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await authFetch(
        `${BACKEND_URL}/order/purchases?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch Purchases");
      const result = await res.json();
      return result;
    },
    [searchQuery, statusFilter, categoryFilter, sortBy]
  );

  // Infinte Scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: [
        "purchase",
        debouncedSearch,
        statusFilter,
        categoryFilter,
        sortBy,
      ],
      queryFn: fetchPurchases,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.data.length < PAGE_SIZE ? undefined : allPages.length + 1,
    });

  //

  const purchases = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const stats: PurchaseStatsType = useMemo(() => {
    return (
      data?.pages?.[0]?.purchaseStats ?? {
        totalPurchases: 0,
        totalSpent: 0,
        completedOrders: 0,
        pendingReviews: 0,
      }
    );
  }, [data]);

  const handleRatePurchase = (
    purchaseId: string,
    rating: number,
    review: string
  ) => {
    // setPurchases(prev =>
    //   prev.map(purchase =>
    //     purchase.id === purchaseId
    //       ? { ...purchase, rating, review }
    //       : purchase
    //   )
    // );
  };

  /* ---------------- INFINITE SCROLL OBSERVER ---------------- */
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (lastItemRef.current) observer.observe(lastItemRef.current);
    return () => {};
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (!isLoading && !session) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-600 mt-2">
            View and manage all your purchased items from other students
          </p>
        </div>

        {/* Stats */}
        <PurchaseStats stats={stats} />

        {/* Filters */}
        <PurchaseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Purchases List or Empty State */}
        {purchases.length === 0 ? (
          <EmptyPurchases />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase, index) => {
              const isLast = index === purchases.length - 1;
              return (
                <div key={purchase.id} ref={isLast ? lastItemRef : null}>
                  <PurchaseItem
                    purchase={purchase}
                    onRatePurchase={handleRatePurchase}
                  />
                </div>
              );
            })}
          </div>
        )}
        {hasNextPage && (
          <div className="w-full">
            <div>
              {isFetchingNextPage && <ContentLoader columns={3} count={8} type="grid" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
