"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterState, Item } from "@/lib/types/types";
import { ShopNavBar } from "@/components/shop/header";
import { Categories } from "@/components/shop/categories";
import { ItemCard } from "@/components/shop/itemcard";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { getUserLocation } from "@/lib/location";
import { mockItems } from "@/data/Shop";

export default function ShopPage() {
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

  const ref = useRef(0);
  ref.current = ref.current + 1;
  console.log(ref.current)

  // ------------------------
  // API Fetch Function
  // ------------------------
  const fetchProducts = async ({ pageParam = 0 }): Promise<Item[]> => {
    const location = await getUserLocation();

    let query: string[] = [];

    if (location)
      query.push(`lat=${location.latitude}&lng=${location.longitude}`);

    if (searchQuery) query.push(`searchQuery=${searchQuery}`);
    if (filters.category !== "all")
      query.push(`category=${filters.category}`);

    query.push(`minPrice=${filters.priceRange[0]}`);
    query.push(`maxPrice=${filters.priceRange[1]}`);

    filters.condition.forEach((c) => query.push(`condition=${c}`));
    filters.exchangeType.forEach((e) => query.push(`exchangeType=${e}`));
    query.push(`maxDistance=${filters.distance}`);

    query.push(`offset=${pageParam}`);
    query.push(`limit=10`);

    const url = `${BACKEND_URL}/product?${query.join("&")}`;

    const res = await authFetch(url);
    return res.json();
  };

  // ------------------------
  // Infinite Query
  // ------------------------
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", filters, searchQuery],
    queryFn: fetchProducts,
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length * 10;
    },

    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // ------------------------
  // Combine all pages
  // ------------------------
  const items = data?.pages.flat() ?? [];

  // ------------------------
  // Infinite Scroll Observer
  // ------------------------
  useEffect(() => {
    if (!lastItemRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(lastItemRef.current);
    return () => observer.disconnect();
  }, [items, hasNextPage]);

  // ------------------------
  // Filters Reset
  // ------------------------
  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 5000],
      condition: [],
      exchangeType: [],
      distance: 10,
    });
    setSearchQuery("");
    refetch();
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const toggleCart = (id: string) => {
    setCart((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

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

          {/* <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>Sort by: Newest</option>
            <option>Price Low → High</option>
            <option>Price High → Low</option>
            <option>Distance</option>
            <option>Rating</option>
          </select> */}
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
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {items.map((item, idx) => {
                const isLast = idx === items.length - 1;

                return (
                  <div
                    key={item.id}
                    ref={isLast ? lastItemRef : null}
                  >
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
            </AnimatePresence>
          </motion.div>
        )}

        {isFetchingNextPage && (
          <p className="text-center mt-4 text-gray-600">Loading more...</p>
        )}
      </div>
    </div>
  );
}
