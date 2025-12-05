// components/shop/NotFound.tsx
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NotFoundProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ProductNotFound({
  title = "Product Not Found",
  message = "The product you're looking for doesn't exist or has been removed.",
  showRetry = true,
  onRetry,
}: NotFoundProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon Container */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Shop
          </Link>

          {showRetry && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center px-6 py-3 border border-green-300 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-all duration-200 hover:border-green-400"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-green-50 rounded-xl border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Try these suggestions:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            {/* <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1 mr-3" />
              Check the spelling of the product name
            </li> */}
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1 mr-3" />
              Browse similar items in the shop
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1 mr-3" />
              <Link className="text-blue-500 hover:text-blue-700" href={'/contact'}>Contact support </Link>&nbsp;if you believe this is an bug 
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}