import { motion } from 'framer-motion';
import { Listing } from '@/lib/types/dashboard/listings/listings';

interface DeleteModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ isOpen, listing, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Listing
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{listing.title}"? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}