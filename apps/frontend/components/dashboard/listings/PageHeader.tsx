import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ListingStats } from '@/lib/types/dashboard/listings/listings';
import StatsCard from './StatsCard';

interface PageHeaderProps {
  stats: ListingStats;
}

export default function PageHeader({ stats }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage your items for sale, exchange, or donation</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Item</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatsCard title="Total Items" value={stats.total} />
        <StatsCard title="Active" value={stats.active} color="text-green-600" />
        <StatsCard title="Sold" value={stats.sold} color="text-gray-600" />
        <StatsCard title="Drafts" value={stats.draft} color="text-yellow-600" />
      </div>
    </div>
  );
}