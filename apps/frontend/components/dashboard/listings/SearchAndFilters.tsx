import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  onResetFilters: () => void;
}

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onResetFilters
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Views</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="books">Books</option>
                <option value="uniform">Uniforms</option>
                <option value="calculator">Calculators</option>
                <option value="geometry">Geometry Sets</option>
                <option value="bag">Bags</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={onResetFilters}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}