"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listing } from "@/lib/types/dashboard/listings/listings";
import PageHeader from "@/components/dashboard/listings/PageHeader";
import SearchAndFilters from "@/components/dashboard/listings/SearchAndFilters";
import ListingCard from "@/components/dashboard/listings/ListingCard";
import EmptyState from "@/components/dashboard/listings/EmptyState";
import DeleteModal from "@/components/dashboard/listings/DeleteModal";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const calculateStats = (listings: Listing[]) => ({
    total: listings.length,
    active: listings.filter((item) => item.status === "active").length,
    sold: listings.filter((item) => item.status === "sold").length,
    draft: listings.filter((item) => item.status === "draft").length,
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockListings: Listing[] = [
      {
        id: "1",
        title: "Calculus Early Transcendentals 2nd Edition",
        description: "Like new condition, perfect for engineering students",
        price: 2500,
        originalPrice: 4000,
        image: "/api/placeholder/300/200",
        status: "active",
        category: "books",
        condition: "excellent",
        views: 24,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
        exchangeType: "sale"
      },
      {
        id: "2",
        title: "Oxford University Uniform Set",
        description: "Complete uniform set with blazer and trousers",
        price: 1500,
        image: "/api/placeholder/300/200",
        status: "sold",
        category: "uniform",
        condition: "good",
        views: 18,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-12",
        exchangeType: "sale"
      },
      {
        id: "3",
        title: "Scientific Calculator FX-991ES",
        description: "Casio scientific calculator, all functions working",
        price: 800,
        image: "/api/placeholder/300/200",
        status: "reserved",
        category: "calculator",
        condition: "excellent",
        views: 32,
        createdAt: "2024-01-08",
        updatedAt: "2024-01-14",
        exchangeType: "sale"
      },
      {
        id: "4",
        title: "Geometry Box Complete Set",
        description: "Full geometry set with compass and protector",
        price: 300,
        image: "/api/placeholder/300/200",
        status: "active",
        category: "geometry",
        condition: "good",
        views: 8,
        createdAt: "2024-01-18",
        updatedAt: "2024-01-18",
        exchangeType: "exchange"
      },
      {
        id: "5",
        title: "School Backpack Waterproof",
        description: "Waterproof backpack with laptop compartment",
        price: 1200,
        image: "/api/placeholder/300/200",
        status: "draft",
        category: "bag",
        condition: "fair",
        views: 0,
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
        exchangeType: "sale"
      },
      {
        id: "6",
        title: "Physics Textbook Advanced",
        description: "Physics concepts and problems for college",
        price: 0,
        image: "/api/placeholder/300/200",
        status: "active",
        category: "books",
        condition: "good",
        views: 15,
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16",
        exchangeType: "donation"
      }
      // ... other mock listings
    ];

    setListings(mockListings);
    setFilteredListings(mockListings);
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
