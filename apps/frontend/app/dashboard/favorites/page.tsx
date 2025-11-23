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
    const mockFavorites: FavoriteItem[] = [
      {
        id: "1",
        item: {
          id: "item1",
          title: "Calculus Early Transcendentals 2nd Edition",
          description: "Like new condition, perfect for engineering students",
          price: 2500,
          originalPrice: 4000,
          image: "/imgshop/phybook.png",
          category: "books",
          condition: "excellent",
          status: "available",
          exchangeType: "sale",
          seller: {
            id: "seller1",
            name: "Ali Ahmed",
            avatar: "/ali.png",
            rating: 4.8,
            verified: true
          },
          location: "University Library",
          distance: 1.2,
          views: 24,
          createdAt: "2024-01-15"
        },
        addedAt: "2024-01-20"
      },
      {
        id: "2",
        item: {
          id: "item2",
          title: "Oxford University Uniform Set",
          description: "Complete uniform set with blazer and trousers",
          price: 1500,
          image: "/imgshop/oxforduniform.png",
          category: "uniform",
          condition: "good",
          status: "available",
          exchangeType: "sale",
          seller: {
            id: "seller2",
            name: "Sara Khan",
            avatar: "/api/placeholder/100/100",
            rating: 4.9,
            verified: true
          },
          location: "Student Center",
          distance: 2.5,
          views: 18,
          createdAt: "2024-01-10"
        },
        addedAt: "2024-01-18"
      },
      {
        id: "3",
        item: {
          id: "item3",
          title: "Scientific Calculator FX-991ES",
          description: "Casio scientific calculator, all functions working",
          price: 800,
          image: "/imgshop/calc.png",
          category: "calculator",
          condition: "excellent",
          status: "sold",
          exchangeType: "sale",
          seller: {
            id: "seller3",
            name: "Bilal Raza",
            avatar: "/api/placeholder/100/100",
            rating: 4.5,
            verified: false
          },
          location: "Engineering Building",
          distance: 0.8,
          views: 32,
          createdAt: "2024-01-08"
        },
        addedAt: "2024-01-16"
      },
      {
        id: "4",
        item: {
          id: "item4",
          title: "Geometry Box Complete Set",
          description: "Full geometry set with compass and protector",
          price: 300,
          image: "/imgshop/geomat.png",
          category: "geometry",
          condition: "good",
          status: "available",
          exchangeType: "exchange",
          seller: {
            id: "seller4",
            name: "Fatima Noor",
            avatar: "/api/placeholder/100/100",
            rating: 4.7,
            verified: true
          },
          location: "Science Block",
          distance: 3.1,
          views: 8,
          createdAt: "2024-01-18"
        },
        addedAt: "2024-01-19"
      },
      {
        id: "5",
        item: {
          id: "item5",
          title: "Physics Textbook Advanced",
          description: "Physics concepts and problems for college",
          price: 0,
          image: "/api/placeholder/300/200",
          category: "books",
          condition: "good",
          status: "available",
          exchangeType: "donation",
          seller: {
            id: "seller5",
            name: "Usman Ali",
            avatar: "/api/placeholder/100/100",
            rating: 4.6,
            verified: true
          },
          location: "Main Campus",
          distance: 1.8,
          views: 15,
          createdAt: "2024-01-16"
        },
        addedAt: "2024-01-17"
      }
    ];

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