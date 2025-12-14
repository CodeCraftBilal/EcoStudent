// components/dashboard/purchase/ReviewForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Star, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void> | void;
  purchaseId: string;
  itemTitle: string;
  currentRating?: number;
  currentReview?: string;
}

export default function ReviewForm({
  isOpen,
  onClose,
  onSubmit,
  purchaseId,
  itemTitle,
  currentRating = 0,
  currentReview = "",
}: ReviewFormProps) {
  const [rating, setRating] = useState(currentRating);
  const [review, setReview] = useState(currentReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !review.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, review);
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-green-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rate Your Purchase
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {itemTitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate this purchase?
                  </label>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hoverRating || rating)
                              ? "text-[#F59E0B] fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {rating === 0
                      ? "Select a rating"
                      : rating === 1
                      ? "Poor"
                      : rating === 2
                      ? "Fair"
                      : rating === 3
                      ? "Good"
                      : rating === 4
                      ? "Very Good"
                      : "Excellent"}
                  </p>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Share your experience
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="What did you like about this purchase? Was the item as described? How was the seller?"
                    rows={4}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your review will help other students make better decisions.
                  </p>
                </div>

                {/* Character Counter */}
                <div className="flex justify-end mb-2">
                  <span
                    className={`text-sm ${
                      review.length > 500 ? "text-[#EF4444]" : "text-gray-500"
                    }`}
                  >
                    {review.length}/500 characters
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={rating === 0 || !review.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-[#3B82F6] text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Review
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full mt-3 text-gray-600 font-medium py-3 px-4 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}