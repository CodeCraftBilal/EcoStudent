"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listing } from "@/lib/types/dashboard/listings/listings";
import PageHeader from "@/components/dashboard/listings/PageHeader";
import SearchAndFilters from "@/components/dashboard/listings/SearchAndFilters";
import ListingCard from "@/components/dashboard/listings/ListingCard";
import EmptyState from "@/components/dashboard/listings/EmptyState";
import DeleteModal from "@/components/dashboard/listings/DeleteModal";
import { BACKEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";
import { mockListingsData } from "@/data/dashboard/listings";
import { useSession } from "@/context/useSession";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter()
  const {isLoading, session} = useSession();

  const calculateStats = (listings: Listing[]) => ({
    total: listings.length,
    active: listings.filter((item) => item.status === "active").length,
    sold: listings.filter((item) => item.status === "sold").length,
    draft: listings.filter((item) => item.status === "draft").length,
  });

  // checkingSession
  useEffect(() => {
    if(!session && !isLoading) {
      router.push('/auth/signin')
    }
  }, [isLoading, session])
  
  // Mock data - replace with actual API call
  useEffect(() => {
    const mockListings = mockListingsData;
    setListings(mockListings);
    setFilteredListings(mockListings);
  }, []);

    const fetchMyListings = () => {
      
    }

  //   const {
  //   data,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   refetch,
  // } = useInfiniteQuery({
  //   queryKey: ['abc'],
  //   queryFn: fetchMyListings,
    
  // })


  // Filter and sort listings
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing) => listing.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (listing) => listing.category === categoryFilter
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "views":
          return b.views - a.views;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedListing) {
      setListings((prev) =>
        prev.filter((item) => item.id !== selectedListing.id)
      );
      setShowDeleteModal(false);
      setSelectedListing(null);
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  const stats = calculateStats(listings);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader stats={stats} />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          onResetFilters={resetFilters}
        />

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <EmptyState hasListings={listings.length > 0} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <DeleteModal
          isOpen={showDeleteModal}
          listing={selectedListing}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
