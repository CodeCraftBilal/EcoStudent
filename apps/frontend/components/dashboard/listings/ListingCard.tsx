import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Tag, CheckCircle, Clock, Package } from 'lucide-react';
import { Listing } from '@/lib/types/dashboard/listings/listings';

interface ListingCardProps {
  listing: Listing;
  onDelete: (listing: Listing) => void;
}

export default function ListingCard({ listing, onDelete }: ListingCardProps) {


const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'sold':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'reserved':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-4 h-4" />;
    case 'sold':
      return <CheckCircle className="w-4 h-4" />;
    case 'reserved':
      return <Clock className="w-4 h-4" />;
    case 'draft':
      return <Package className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'excellent':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'good':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'fair':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getExchangeTypeColor = (type: string) => {
  switch (type) {
    case 'sale':
      return 'bg-green-50 text-green-700 border-eco-200';
    case 'exchange':
      return 'bg-blue-50 text-blue-700 border-eco-blue-200';
    case 'donation':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(listing.status)}`}>
            {getStatusIcon(listing.status)}
            <span>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</span>
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-1">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getExchangeTypeColor(listing.exchangeType)}`}>
            <Tag className="w-3 h-3" />
            <span>
              {listing.exchangeType === 'sale' ? 'Sale' :
               listing.exchangeType === 'exchange' ? 'Exchange' : 'Free'}
            </span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {listing.title}
          </h3>
        </div>

        {/* <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p> */}

        {/* Price and Condition */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">
              {listing.exchangeType === 'donation' ? 'FREE' : `Rs ${listing.price.toLocaleString()}`}
            </span>
            {listing.originalPrice && listing.exchangeType === 'sale' && (
              <span className="text-sm text-gray-500 line-through">
                Rs {listing.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${getConditionColor(listing.condition)}`}>
            {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
          </span>
        </div>

        {/* Meta Info */}
        <div className=" flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{listing.views} views</span>
            </div>
            <span>•</span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className=" flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Link
              href={`/item/${listing.id}`}
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Link>
            
            {listing.status !== 'sold' && (
              <Link
                href={`/dashboard/listings/edit/${listing.id}`}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {listing.status !== 'sold' && (
              <button
                onClick={() => onDelete(listing)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}