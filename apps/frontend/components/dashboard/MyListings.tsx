"use client";

import { Eye, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Listing } from "@/lib/types/dashboard/types";

interface MyListingsProps {
  listings: Listing[];
}

export default function MyListings({ listings }: MyListingsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
        <Link href="/dashboard/listings" className="text-eco-600 hover:text-eco-700 text-sm font-medium">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {listings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't listed any items yet</p>
            <Link href="/dashboard/upload" className="text-eco-600 hover:text-eco-700 font-medium mt-2 inline-block">
              List your first item
            </Link>
          </div>
        ) : (
          listings.slice(0, 5).map((listing) => (
            <div key={listing.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {listing.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(listing.status)}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-semibold text-eco-600">
                    Rs {listing.price.toLocaleString()}
                  </span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views} views</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(listing.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/item/${listing.id}/edit`}
                  className="p-2 text-gray-400 hover:text-eco-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}