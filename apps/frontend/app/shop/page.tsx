"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState, Item } from "@/lib/types/types";
import { ShopNavBar } from "@/components/shop/header";
import { Categories } from "@/components/shop/categories";
import { ItemCard } from "@/components/shop/itemcard";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { mockItems } from "@/data/Shop";
import { getUserLocation } from "@/lib/location";

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 5000],
    condition: [],
    exchangeType: [],
    distance: 10,
  });

  // Apply filters
  useEffect(() => {
    const getAllItems = async () => {
      const location = await getUserLocation()
      console.log('location', location);
      setLoading(true);
      let query: string[] = [];

      // location filter
      if(location) {
        query.push(`lat=${location.latitude}&lng=${location.longitude}`)
      }
      // Search filter
      if (searchQuery) {
        query.push(`searchQuery=${searchQuery}`);
      }

      // Category filter
      if (filters.category !== "all") {
        query.push(`category=${filters.category}`);
      }

      // Price filter
      if (filters.priceRange.length > 0) {
        const minPrice = filters.priceRange[0];
        const maxPrice = filters.priceRange[1];
        query.push(`minPrice=${minPrice}`);
        query.push(`maxPrice=${maxPrice}`);
      }

      // Condition filter
      if (filters.condition.length > 0) {
        filters.condition.forEach((c) => {
          query.push(`condition=${c}`);
        });
      }

      // Exchange type filter

      if (filters.exchangeType.length > 0) {
        filters.exchangeType.forEach((e) => {
          query.push(`exchangeType=${e}`);
        });
      }

      // Distance filter
      query.push(`maxDistance=${filters.distance}`);

      const params = query.join("&");
      
      try {
        const res = await authFetch(`${BACKEND_URL}/product?${params}`);
        if (!res.ok) {
        }

        const result = await res.json();
        
        console.log(result)
        if (result.error) {
          setItems([]);
        } else {
          setItems(result);
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    getAllItems();
  }, [filters, searchQuery]);

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (itemId: string) => {
    const newCart = new Set(cart);
    if (newCart.has(itemId)) {
      newCart.delete(itemId);
    } else {
      newCart.add(itemId);
    }
    setCart(newCart);
  };

  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 5000],
      condition: [],
      exchangeType: [],
      distance: 10,
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Search */}
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
        {/* Categories */}
        <Categories
          selectedCategory={filters.category}
          onCategorySelect={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          categories={[]}
        />

        {/* Results Count and Sort */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">
            Showing {items.length} of {mockItems.length} items
          </p>
          <div className="flex space-x-4">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Sort by: Newest</option>
              <option>Sort by: Price Low to High</option>
              <option>Sort by: Price High to Low</option>
              <option>Sort by: Distance</option>
              <option>Sort by: Rating</option>
            </select>
          </div>
        </div>

        {/* Items Grid - 2 columns on mobile, responsive on larger screens */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={resetFilters}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
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
              {items.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  isFavorite={favorites.has(item.id)}
                  isInCart={cart.has(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCart={toggleCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Chat Component */}
      {/* <div className="bg-transparent">
      <Chat showChat={showChat} setShowChat={setShowChat} draggable={true}/>
      </div> */}
    </div>
  );
}
