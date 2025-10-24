"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Purchase } from "@/lib/types/dashboard/purchase/purchase";
import PurchaseItem from "./PurchaseItem";

interface PurchaseListProps {
  purchases: Purchase[];
  onRatePurchase: (purchaseId: string, rating: number, review: string) => void;
}

export default function PurchaseList({ purchases, onRatePurchase }: PurchaseListProps) {
  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases found</h3>
        <p className="text-gray-600">
          When you make purchases, they will appear here for you to manage.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence>
        {purchases.map((purchase, index) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <PurchaseItem
              purchase={purchase}
              onRatePurchase={onRatePurchase}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}