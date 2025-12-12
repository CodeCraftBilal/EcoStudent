"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterState, Item } from "@/lib/types/types";
import { ShopNavBar } from "@/components/shop/header";
import { Categories } from "@/components/shop/categories";
import ItemCard from "@/components/shop/itemcard";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { getUserLocation } from "@/lib/location";
import { ContentLoader } from "@/components/Loading";

export default function ShopPage() {
  // ----------------------------------
  // State
  // ----------------------------------
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 5000],
    condition: [],
    exchangeType: [],
    distance: 10,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // ----------------------------------
  // Stable memoized filters
  // ----------------------------------
  const stableFilters = useMemo(() => filters, [filters]);

  // ----------------------------------
  // Fetch Function (Memoized)
  // ----------------------------------
  const fetchProducts = useCallback(
    async ({ pageParam = 0 }): Promise<Item[]> => {
      const location = await getUserLocation();

      const params = new URLSearchParams();

      if (location) {
        params.append("lat", String(location.latitude));
        params.append("lng", String(location.longitude));
      }

      if (searchQuery) params.append("searchQuery", searchQuery);
      if (stableFilters.category !== "all")
        params.append("category", stableFilters.category);

      params.append(
        "minPrice",
        stableFilters.priceRange[0].toString()
      );
      params.append(
        "maxPrice",
        stableFilters.priceRange[1].toString()
      );

      stableFilters.condition.forEach((c) =>
        params.append("condition", c)
      );

      stableFilters.exchangeType.forEach((e) =>
        params.append("exchangeType", e)
      );

      params.append("maxDistance", stableFilters.distance.toString());
      params.append("offset", pageParam.toString());
      params.append("limit", "12");

      const url = `${BACKEND_URL}/product?${params.toString()}`;

      const res = await authFetch(url);
      return res.json();
    },
    [searchQuery, stableFilters]
  );

  // ----------------------------------
  // Infinite Query
  // ----------------------------------
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["products", stableFilters, searchQuery],
      queryFn: fetchProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 12) return undefined;
        return allPages.length * 12;
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  // ----------------------------------
  // Flatten pages (Memoized)
  // ----------------------------------
  const items = useMemo(() => {
    return data?.pages?.flat() ?? [];
  }, [data]);

  // ----------------------------------
  // Infinite Scroll Observer (Optimized)
  // ----------------------------------
  useEffect(() => {
    if (!lastItemRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(lastItemRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // ----------------------------------
  // Memoized Callbacks
  // ----------------------------------
  const resetFilters = useCallback(() => {
    setFilters({
      category: "all",
      priceRange: [0, 5000],
      condition: [],
      exchangeType: [],
      distance: 10,
    });

    setSearchQuery("");
    refetch();
  }, [refetch]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }, []);

  const toggleCart = useCallback((id: string) => {
    setCart((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }, []);

  // ----------------------------------
  // Render
  // ----------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <ShopNavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.size}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={resetFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Categories
          selectedCategory={filters.category}
          onCategorySelect={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          categories={[]}
        />

        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600 py-2">
            Showing {items.length} of {items.length} items
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="text-lg font-semibold">No items found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div
            // layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
              {items.map((item, idx) => {
                const isLast = idx === items.length - 1;

                return (
                  <div key={item.id} ref={isLast ? lastItemRef : null}>
                    <ItemCard
                      item={item}
                      index={idx}
                      isFavorite={favorites.has(item.id)}
                      isInCart={cart.has(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onToggleCart={toggleCart}
                    />
                  </div>
                );
              })}
           </div>
        )}

        {isFetchingNextPage && (
          <div className="w-full h-20 flex items-center justify-center">
            <ContentLoader columns={4} count={8} type="grid" />
          </div>
        )}
      </div>
    </div>
  );
}
