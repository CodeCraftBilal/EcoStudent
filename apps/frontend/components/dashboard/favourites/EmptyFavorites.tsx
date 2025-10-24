"use client";

import { Heart, ArrowRight, Search, Star, MapPin } from "lucide-react";
import Link from "next/link";

export default function EmptyFavorites() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-10 h-10 text-pink-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        No Favorite Items Yet
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto mb-2">
        Your favorite items will appear here. Start exploring and save items you love for quick access later.
      </p>
      
      <p className="text-gray-500 text-sm mb-8">
        Save books, uniforms, calculators, and more to build your wishlist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center space-x-2 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg font-semibold"
        >
          <Search className="w-5 h-5" />
          <span>Explore Marketplace</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        
        <Link
          href="/shop?filter=nearby"
          className="inline-flex items-center justify-center space-x-2 border-2 border-eco-500 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-colors font-semibold"
        >
          <MapPin className="w-5 h-5" />
          <span>Find Nearby Items</span>
        </Link>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Quick Access</h4>
          <p className="text-gray-600 text-sm">Save items you're interested in for later</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Price Alerts</h4>
          <p className="text-gray-600 text-sm">Get notified if prices drop on saved items</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Local Deals</h4>
          <p className="text-gray-600 text-sm">Find great deals from students near you</p>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mt-8">
        <h4 className="font-semibold text-gray-900 mb-4">Popular Categories to Explore</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {['Textbooks', 'Calculators', 'Uniforms', 'Geometry Sets', 'Bags', 'Lab Coats'].map((category) => (
            <Link
              key={category}
              href={`/shop?category=${category.toLowerCase().replace(' ', '-')}`}
              className="px-4 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-lg transition-colors text-sm font-medium"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}