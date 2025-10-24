import Link from 'next/link';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasListings: boolean;
}

export default function EmptyState({ hasListings }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasListings ? "No listings found" : "No listings yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasListings 
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start by listing your first item for sale, exchange, or donation."
        }
      </p>
      <Link
        href="/dashboard/upload"
        className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">
          {hasListings ? "Add New Item" : "Add Your First Item"}
        </span>
      </Link>
    </div>
  );
}