// components/Loading/DashboardLoader.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonCard from './SkeletonCard';

const DashboardLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8 z-0">
      {/* Header Skeleton */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-200 rounded-full animate-pulse"></div>
            <div>
              <div className="w-32 h-6 bg-green-200 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-green-100 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-200 rounded-full animate-pulse"></div>
            <div className="w-10 h-10 bg-green-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-6 bg-green-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-green-100 rounded-full animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-green-300 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-green-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="w-48 h-8 bg-green-200 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-green-100 rounded animate-pulse"></div>
            </div>

            {/* Activity List */}
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 animate-pulse"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="w-3/4 h-4 bg-green-200 rounded"></div>
                      <div className="w-1/2 h-3 bg-green-100 rounded"></div>
                      <div className="w-20 h-3 bg-green-50 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <div className="w-32 h-6 bg-green-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-green-50"
                  >
                    <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                    <div className="w-24 h-4 bg-green-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
              <div className="w-40 h-6 bg-green-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-4 bg-green-200 rounded"></div>
                      <div className="w-20 h-3 bg-green-100 rounded"></div>
                      <div className="w-16 h-3 bg-green-50 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <div className="mt-4 space-y-2">
              <div className="text-xl font-semibold text-green-600">
                Preparing Your Dashboard
              </div>
              <div className="text-gray-600">
                Loading your books, messages, and recent activity...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;