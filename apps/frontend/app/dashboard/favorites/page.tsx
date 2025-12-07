"use client";

import { useState, useEffect } from "react";
import { 
  FavoriteStats, 
  FavoriteFilters, 
  FavoriteList, 
  EmptyFavorites 
} from "@/components/dashboard/favourites/index";
import { FavoriteItem, FavoriteStats as FavoriteStatsType } from "@/lib/types/dashboard/favourites/favourites";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { useSession } from "@/context/useSession";
import { useRouter } from "next/navigation";
import { mockFavoritesData } from "@/data/dashboard/favorite";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recently-added");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const {isLoading, session, setSession} = useSession();
  const router = useRouter();

  // check the session
  useEffect(() => {
    const fetchClientSession = async () => {
      if(!session) {
        const res = await authFetch(`${BACKEND_URL}/auth/session`, {
          method: 'GET',
          headers: {
            'Content-Type':'application/json'
          }
        });
        if(!res.ok) {
          console.log(`Session Failed to fetch: `, res.statusText, res.status)
        }
        const result = await res.json();
        if(result.error) {
          router.push('/auth/signin');
        }
        setSession(result);
      }
    }

    fetchClientSession();
  }, [])
  
  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchFavorits = async () => {
          const res = await authFetch(`${BACKEND_URL}/product/favorits`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if(!res.ok) {
            console.log(`${res.statusText} ${res.status}`)
          }
          const result = res.json();
          console.log(result);
        }
        fetchFavorits();
    const mockFavorites = mockFavoritesData;

    setFavorites(mockFavorites);
    setFilteredFavorites(mockFavorites);
  }, []);

  // Filter and sort favorites
  useEffect(() => {
    let filtered = favorites;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(favorite =>
        favorite.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        favorite.item.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(favorite => favorite.item.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(favorite => favorite.item.category === categoryFilter);
    }

    // Price range filter
    filtered = filtered.filter(favorite => 
      favorite.item.price >= priceRange[0] && favorite.item.price <= priceRange[1]
    );

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime();
        case "oldest":
          return new Date(a.item.createdAt).getTime() - new Date(b.item.createdAt).getTime();
        case "price-high":
          return b.item.price - a.item.price;
        case "price-low":
          return a.item.price - b.item.price;
        case "recently-added":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case "distance":
          return a.item.distance - b.item.distance;
        default:
          return 0;
      }
    });

    setFilteredFavorites(filtered);
  }, [favorites, searchQuery, statusFilter, categoryFilter, sortBy, priceRange]);

  // Calculate stats
  const stats: FavoriteStatsType = {
    totalFavorites: favorites.length,
    availableItems: favorites.filter(f => f.item.status === 'available').length,
    priceDrops: favorites.filter(f => f.item.originalPrice && f.item.price < f.item.originalPrice).length,
    nearbyItems: favorites.filter(f => f.item.distance <= 5).length
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  const handleAddToCart = (itemId: string) => {
    console.log("Adding item to cart:", itemId);
    // Implement add to cart logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-2">
            Your saved items for quick access and price tracking
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

        {/* Favorites List or Empty State */}
        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <FavoriteList
            favorites={filteredFavorites}
            onRemoveFavorite={handleRemoveFavorite}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  );
}