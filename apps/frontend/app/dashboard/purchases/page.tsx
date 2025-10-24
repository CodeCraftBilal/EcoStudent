"use client";

import { useState, useEffect } from "react";
import { 
  PurchaseStats, 
  PurchaseFilters, 
  PurchaseList, 
  EmptyPurchases 
} from "@/components/dashboard/purchase/index";
import { Purchase, PurchaseStats as PurchaseStatsType } from "@/lib/types/dashboard/purchase/purchase";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockPurchases: Purchase[] = [
      {
        id: "1",
        item: {
          id: "item1",
          title: "Calculus Early Transcendentals 2nd Edition",
          description: "Like new condition, perfect for engineering students",
          price: 2500,
          image: "/api/placeholder/300/200",
          category: "books",
          condition: "excellent"
        },
        seller: {
          id: "seller1",
          name: "Ali Ahmed",
          avatar: "/api/placeholder/100/100",
          rating: 4.8,
          verified: true
        },
        status: "completed",
        purchaseDate: "2024-01-15",
        deliveredDate: "2024-01-16",
        quantity: 1,
        totalAmount: 2500,
        paymentMethod: "easypaisa",
        meetupLocation: "University Library",
        rating: 5,
        review: "Book was in perfect condition, seller was very professional!"
      },
      {
        id: "2",
        item: {
          id: "item2",
          title: "Oxford University Uniform Set",
          description: "Complete uniform set with blazer and trousers",
          price: 1500,
          image: "/api/placeholder/300/200",
          category: "uniform",
          condition: "good"
        },
        seller: {
          id: "seller2",
          name: "Sara Khan",
          avatar: "/api/placeholder/100/100",
          rating: 4.9,
          verified: true
        },
        status: "completed",
        purchaseDate: "2024-01-10",
        deliveredDate: "2024-01-12",
        quantity: 1,
        totalAmount: 1500,
        paymentMethod: "jazzcash",
        meetupLocation: "Student Center"
      },
      {
        id: "3",
        item: {
          id: "item3",
          title: "Scientific Calculator FX-991ES",
          description: "Casio scientific calculator, all functions working",
          price: 800,
          image: "/api/placeholder/300/200",
          category: "calculator",
          condition: "excellent"
        },
        seller: {
          id: "seller3",
          name: "Bilal Raza",
          avatar: "/api/placeholder/100/100",
          rating: 4.5,
          verified: false
        },
        status: "cancelled",
        purchaseDate: "2024-01-08",
        quantity: 1,
        totalAmount: 800,
        paymentMethod: "cash",
        meetupLocation: "Engineering Building"
      },
      {
        id: "4",
        item: {
          id: "item4",
          title: "Physics Textbook Advanced",
          description: "Physics concepts and problems for college",
          price: 0,
          image: "/api/placeholder/300/200",
          category: "books",
          condition: "good"
        },
        seller: {
          id: "seller4",
          name: "Fatima Noor",
          avatar: "/api/placeholder/100/100",
          rating: 4.7,
          verified: true
        },
        status: "completed",
        purchaseDate: "2024-01-05",
        deliveredDate: "2024-01-06",
        quantity: 1,
        totalAmount: 0,
        paymentMethod: "cash",
        meetupLocation: "Science Block",
        rating: 4,
        review: "Free book in great condition, very generous!"
      }
    ];

    setPurchases(mockPurchases);
    setFilteredPurchases(mockPurchases);
  }, []);

  // Filter and sort purchases
  useEffect(() => {
    let filtered = purchases;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(purchase =>
        purchase.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(purchase => purchase.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(purchase => purchase.item.category === categoryFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case "oldest":
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        case "price-high":
          return b.item.price - a.item.price;
        case "price-low":
          return a.item.price - b.item.price;
        case "amount-high":
          return b.totalAmount - a.totalAmount;
        case "amount-low":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredPurchases(filtered);
  }, [purchases, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Calculate stats
  const stats: PurchaseStatsType = {
    totalPurchases: purchases.length,
    totalSpent: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
    completedOrders: purchases.filter(p => p.status === 'completed').length,
    pendingReviews: purchases.filter(p => p.status === 'completed' && !p.rating).length
  };

  const handleRatePurchase = (purchaseId: string, rating: number, review: string) => {
    setPurchases(prev => 
      prev.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, rating, review }
          : purchase
      )
    );
  };

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
          <PurchaseList
            purchases={filteredPurchases}
            onRatePurchase={handleRatePurchase}
          />
        )}
      </div>
    </div>
  );
}