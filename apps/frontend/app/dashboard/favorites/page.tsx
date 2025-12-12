"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FavoriteStats,
  FavoriteFilters,
  EmptyFavorites,
} from "@/components/dashboard/favourites";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useSession } from "@/context/useSession";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getUserLocation } from "@/lib/location";
import { ContentLoader } from "@/components/Loading";
import { Item } from "@/lib/types/types";
import ItemCard from "@/components/shop/itemcard";
import { addToFavorite, removeFromFavorite } from "@/lib/utils/favorite";
import { SnackbarProvider, useSnackbar } from "@/components/ui/dialogBoxes/SnackBarManager";

const PAGE_SIZE = 10;

type ApiResponse = {
  data: Item[];
  totalFavorites: number;
  availableItems: number;
  priceDrops: number;
  nearbyItems: number;
};

const FavoritesPage = () => {
  const router = useRouter();
  const { session, isLoading } = useSession();

  /* ---------------- FILTER STATES ---------------- */

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    if (!session && !isLoading) router.push("/auth/signin");
  }, [session, isLoading, router]);

  /* ---------------- FETCHER ---------------- */

  const fetchFavorites = useCallback(
    async ({ pageParam = 1 }): Promise<ApiResponse> => {
      const location = await getUserLocation();

      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(PAGE_SIZE),
        minPrice: String(priceRange[0]),
        maxPrice: String(priceRange[1]),
      });

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);
      if (sortBy) params.append("sortBy", sortBy);

      if (location) {
        params.append("lat", String(location.latitude));
        params.append("lng", String(location.longitude));
      }

      const res = await authFetch(
        `${BACKEND_URL}/favorite/user?${params.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch favorites");

      return res.json();
    },
    [
      searchQuery,
      statusFilter,
      categoryFilter,
      sortBy,
      priceRange[0],
      priceRange[1],
    ]
  );

  /* ---------------- QUERY ---------------- */

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
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
        lastPage.data.length < PAGE_SIZE ? undefined : allPages.length + 1,
    });

  /* ---------------- DATA ---------------- */

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

  /* ---------------- REMOVE FAVORITE ---------------- */

  const { showSuccess, showError, showSnackbar } = useSnackbar()
  const queryClient = useQueryClient();

  const handleRemoveFavorite = useCallback(
    async (favoriteId: string) => {
      console.log("Removing favorite:", favoriteId);

      try {
        const favoriteRes = await removeFromFavorite(favoriteId);

        if(!favoriteRes.error) {
          showSuccess(`${favoriteRes.message}`, 3000, 'bottom-center')
        } else {
          showError(`${favoriteRes.message}`)
        }
        // Optimistic UI update — instantly removes from list
        queryClient.setQueryData(
          [
            "favorites",
            searchQuery,
            statusFilter,
            categoryFilter,
            sortBy,
            priceRange[0],
            priceRange[1],
          ],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                data: page.data.filter((item: any) => item.id !== favoriteId),
              })),
            };
          }
        );

        // Ensure backend sync (optional but safe)
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      } catch (err) {
        console.error("Failed to remove favorite:", err);
      }
    },
    [queryClient, searchQuery, statusFilter, categoryFilter, sortBy, priceRange]
  );

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

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
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
            <ContentLoader columns={4} type="grid" count={4} />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((favorite, index) => {
                const isLast = index === favorites.length - 1;

                return (
                  <div key={index} ref={isLast ? lastItemRef : null}>
                    <ItemCard
                      item={favorite}
                      index={index}
                      isFavorite={true}
                      onToggleFavorite={handleRemoveFavorite}
                    />
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Loading */}
            {isFetchingNextPage && (
              <div className="w-full mt-6 flex justify-center">
                <ContentLoader columns={4} count={4} type="grid" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <FavoritesPage />
    </SnackbarProvider>
  );
};

export default App;
