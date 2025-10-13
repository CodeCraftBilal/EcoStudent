"use client";

import { Search, MapPin, ShoppingCart, Filter } from "lucide-react";
import { Filters, FiltersProps } from "./filters";

interface HeaderProps extends FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
}

export function Header({
  searchQuery,
  setSearchQuery,
  cartCount,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  onResetFilters,
}: HeaderProps) {
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
    <div className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="max-md:hidden flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              EcoStudent Shop
            </h1>
          </div>

          {/* Search Bar in Header */}
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-4 w-full">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for books, uniforms, calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <div className="flex justify-end mb-4 sm:hidden"></div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Filters Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
  );
}
