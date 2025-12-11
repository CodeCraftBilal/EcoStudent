"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FavoriteStats,
  FavoriteFilters,
  FavoriteList,
  EmptyFavorites,
} from "@/components/dashboard/favourites";

import { FavoriteItem } from "@/lib/types/dashboard/favourites/favourites";

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useSession } from "@/context/useSession";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserLocation } from "@/lib/location";
import { LoadingSpinner } from "@/components/Loading";

const PAGE_SIZE = 10;

/* ---------------- TYPES ---------------- */

type ApiResponse = {
  data: FavoriteItem[];

  totalFavorites: number;
  availableItems: number;
  priceDrops: number;
  nearbyItems: number;
};

/* ---------------- COMPONENT ---------------- */

export default function FavoritesPage() {
  const router = useRouter();
  const { session, isLoading } = useSession();

  /* ---------------- FILTER STATES ---------------- */

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!session && !isLoading) {
      router.push("/auth/signin");
    }
  }, [session, isLoading, router]);

  /* ================= FETCHER ================= */

  const fetchFavorites = useCallback(
    async ({ pageParam = 1 }): Promise<ApiResponse> => {
      const location = await getUserLocation();

      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(PAGE_SIZE),
        minPrice: String(priceRange[0]),
        maxPrice: String(priceRange[1]),
      });

      // Only append active filters
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);
      if (sortBy) params.append("sortBy", sortBy);

      if (location) {
        params.append("lat", String(location.latitude));
        params.append("lng", String(location.longitude));
      }

      const res = await authFetch(
        `${BACKEND_URL}/product/favorits?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch favorites");

      return res.json();
    },
    [
      searchQuery,
      statusFilter,
      categoryFilter,
      sortBy,
      priceRange[0],   // ✅ stable dependency
      priceRange[1],   // ✅ stable dependency
    ]
  );

  /* ================= QUERY ================= */

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "favorites",
      searchQuery,
      statusFilter,
      categoryFilter,
      sortBy,
      priceRange[0],
      priceRange[1],
    ],
    queryFn: fetchFavorites,
    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < PAGE_SIZE
        ? undefined
        : allPages.length + 1,
  });

  /* ================= DATA ================= */

  const favorites = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const stats = useMemo(
    () =>
      data?.pages?.[0]
        ? {
            totalFavorites: data.pages[0].totalFavorites,
            availableItems: data.pages[0].availableItems,
            priceDrops: data.pages[0].priceDrops,
            nearbyItems: data.pages[0].nearbyItems,
          }
        : {
            totalFavorites: 0,
            availableItems: 0,
            priceDrops: 0,
            nearbyItems: 0,
          },
    [data]
  );

  /* ================= ACTIONS ================= */

  const handleRemoveFavorite = useCallback(
    async (favoriteId: string) => {
      await authFetch(
        `${BACKEND_URL}/product/favorits/${favoriteId}`,
        { method: "DELETE" }
      );

      refetch();
    },
    [refetch]
  );

  const handleAddToCart = useCallback((itemId: string) => {
    console.log("Add to cart:", itemId);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Favorites
          </h1>
          <p className="text-gray-600 mt-2">
            Your saved items for tracking and quick access
          </p>
        </div>

        {/* Stats */}
        <FavoriteStats stats={stats} />

        {/* Filters */}
        <FavoriteFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {/* Content */}
        {isFetching && !favorites.length ? (
          <div className="text-center text-gray-500 mt-12 w-full">
            <LoadingSpinner />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <>
            <FavoriteList
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavorite}
              onAddToCart={handleAddToCart}
            />

            {/* Pagination */}
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {isFetchingNextPage
                    ? <LoadingSpinner />
                    : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
