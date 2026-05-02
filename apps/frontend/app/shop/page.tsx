"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterState, Item } from "@/lib/types/types";
import { ShopNavBar } from "@/components/shop/header";
import { Categories } from "@/components/shop/categories";
import ItemCard from "@/components/shop/itemcard";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { getUserLocation } from "@/lib/location";
import { ContentLoader } from "@/components/Loading";
import { addToFavorite, removeFromFavorite } from "@/lib/utils/favorite";
import { useSnackbar } from "@/components/ui/dialogBoxes/SnackBarManager";
import { useSession } from "@/context/useSession";

const ShopPage = () => {
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const { session } = useSession();
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // ----------------------------------
  // Stable memoized filters
  // ----------------------------------
  const stableFilters = useMemo(() => filters, [filters]);

  // fetching favorite item ids

  useEffect(() => {
    const loadFavs = async () => {
      const res = await authFetch(`${BACKEND_URL}/favorite/ids`);
      if (!res.ok) return;
      const ids = await res.json(); // must return array of favorite item IDs

      const strIds = ids.map((id: any) => String(id));
      setFavorites(new Set(strIds));
    };
    loadFavs();
  }, []);

  // ----------------------------------
  // Fetch Function (Memoized)
  // ----------------------------------
  const fetchProducts = useCallback(
    async ({ pageParam = 0 }): Promise<Item[]> => {
      const location = await getUserLocation();

      console.log("user location: ", location);
      const params = new URLSearchParams();

      if (location) {
        params.append("lat", String(location.latitude));
        params.append("lng", String(location.longitude));
      }

      if (debouncedSearch) params.append("searchQuery", debouncedSearch);
      if (stableFilters.category !== "all")
        params.append("category", stableFilters.category);

      params.append("minPrice", stableFilters.priceRange[0].toString());
      params.append("maxPrice", stableFilters.priceRange[1].toString());

      stableFilters.condition.forEach((c) => params.append("condition", c));

      stableFilters.exchangeType.forEach((e) =>
        params.append("exchangeType", e)
      );

      params.append("maxDistance", stableFilters.distance.toString());
      params.append("offset", pageParam.toString());
      params.append("limit", "12");

      const url = `${BACKEND_URL}/product/v2?${params.toString()}`;

      const res = await authFetch(url);
      return res.json();
    },
    [debouncedSearch, stableFilters]
  );

  // ----------------------------------
  // Infinite Query
  // ----------------------------------
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading: isProductsLoading,
  } = useInfiniteQuery({
    queryKey: ["products", stableFilters, debouncedSearch],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 12) return undefined;
      return allPages.length * 12;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(lastItemRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, items]);

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

  const { showSuccess, showError } = useSnackbar();
  const toggleFavorite = useCallback(async (productId: string) => {
  if (!session) return;

  const wasFavorite = favorites.has(productId); // read current state first

  setFavorites((prev) => {
    const newSet = new Set(prev);
    if (wasFavorite) newSet.delete(productId);
    else newSet.add(productId);
    return newSet;
  });

  try {
    const res = wasFavorite
      ? await removeFromFavorite(productId)
      : await addToFavorite(productId);

    if (!res.error) showSuccess(res.message, 4000, "bottom-center");
    else showError(res.message, 4000, "bottom-center");
  } catch (err) {
    console.error("Favorite update failed", err);

    // rollback
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (wasFavorite) newSet.add(productId);
      else newSet.delete(productId);
      return newSet;
    });
  }
}, [favorites, session]);


  // ----------------------------------
  // Render
  // ----------------------------------
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
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

        {isProductsLoading && (
          <div className="w-full">
            <ContentLoader columns={4} count={8} type="grid" />
          </div>
        )}

        {!isProductsLoading && items.length === 0 ? (
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
                    index={Number(item.id)}
                    isFavorite={favorites.has(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              );
            })}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="w-full">
            <ContentLoader columns={4} count={8} type="grid" />
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return <ShopPage />;
};

export default App;
