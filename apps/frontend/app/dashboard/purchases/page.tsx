"use client";

import { useState, useEffect } from "react";
import { 
  PurchaseStats, 
  PurchaseFilters, 
  PurchaseList, 
  EmptyPurchases 
} from "@/components/dashboard/purchase/index";
import { Purchase, PurchaseStats as PurchaseStatsType } from "@/lib/types/dashboard/purchase/purchase";
import { mockPurchasesData } from "@/data/dashboard/purchases";
import { useSession } from "@/context/useSession";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const {isLoading, session} = useSession()

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockPurchases = mockPurchasesData;

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
  
  if(!isLoading && !session) {
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
          <PurchaseList
            purchases={filteredPurchases}
            onRatePurchase={handleRatePurchase}
          />
        )}
      </div>
    </div>
  );
}