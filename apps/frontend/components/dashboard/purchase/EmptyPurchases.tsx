"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EmptyPurchases() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-10 h-10 text-gree-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        No Purchases Yet
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto mb-2">
        You haven't made any purchases yet. Start exploring our marketplace to find amazing deals on books, uniforms, and educational supplies from students near you.
      </p>
      
      <p className="text-gray-500 text-sm mb-8">
        Save money and help the environment by buying from fellow students.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center space-x-2 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg font-semibold"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Start Shopping</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        
        <Link
          href="/how-it-works"
          className="inline-flex items-center justify-center space-x-2 border-2 border-green-500 text-gree-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-colors font-semibold"
        >
          <span>Learn How It Works</span>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Save Money</h4>
          <p className="text-gray-600 text-sm">Buy textbooks at 50-70% off retail prices</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Help the Planet</h4>
          <p className="text-gray-600 text-sm">Reduce waste by reusing educational materials</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Meet Students</h4>
          <p className="text-gray-600 text-sm">Connect with students from your campus</p>
        </div>
      </div>
    </div>
  );
}