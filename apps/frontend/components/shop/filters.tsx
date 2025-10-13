"use client";

import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState } from "@/lib/types/types";

export interface FiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const conditionOptions = [
  { value: "excellent", label: "Excellent", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "Fair", color: "bg-yellow-100 text-yellow-800" }
];

const exchangeTypeOptions = [
  { value: "sale", label: "For Sale", color: "bg-green-100 text-eco-800" },
  { value: "exchange", label: "For Exchange", color: "bg-blue-100 text-eco-blue-800" },
  { value: "donation", label: "Free Donation", color: "bg-purple-100 text-purple-800" }
];

export function Filters({ showFilters, setShowFilters, filters, setFilters, onResetFilters }: FiltersProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex space-x-3">
              <button
                onClick={onResetFilters}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: Rs {filters.priceRange[0]} - Rs {filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Within {filters.distance} km
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={filters.distance}
                onChange={(e) => setFilters({
                  ...filters,
                  distance: parseInt(e.target.value)
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <div className="space-y-2">
                {conditionOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.condition.includes(option.value)}
                      onChange={(e) => {
                        const newConditions = e.target.checked
                          ? [...filters.condition, option.value]
                          : filters.condition.filter(c => c !== option.value);
                        setFilters({ ...filters, condition: newConditions });
                      }}
                      className="rounded border-gray-300 text-eco-600 focus:ring-eco-500"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exchange Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Type
              </label>
              <div className="space-y-2">
                {exchangeTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.exchangeType.includes(option.value)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.exchangeType, option.value]
                          : filters.exchangeType.filter(t => t !== option.value);
                        setFilters({ ...filters, exchangeType: newTypes });
                      }}
                      className="rounded border-gray-300 text-eco-600 focus:ring-eco-500"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}