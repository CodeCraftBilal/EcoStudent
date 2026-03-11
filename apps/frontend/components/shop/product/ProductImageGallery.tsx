"use client";

import { useCallback, useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { addToFavorite, removeFromFavorite } from "@/lib/utils/favorite";
import { useSnackbar } from "@/components/ui/dialogBoxes/SnackBarManager";
import { BACKEND_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  productId: string;
}

export default function ProductImageGallery({
  images,
  title,
  productId,
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const res = await authFetch(`${BACKEND_URL}/favorite/ids`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setIsFavorite(data.map(String).includes(String(productId)));
          }
        }
      } catch (e) {
        console.error("Failed to fetch favorite status", e);
      }
    };
    if (productId) {
      fetchFavoriteStatus();
    }
  }, [productId]);

  const toggleFavorite = useCallback(async () => {
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite);

    try {
      let res;
      if (wasFavorite) {
        res = await removeFromFavorite(productId);
      } else {
        res = await addToFavorite(productId);
      }
      if (!res.error) {
        showSuccess(`${res.message}`, 4000, "bottom-center");
      } else {
        showError(`${res.message}`, 4000, "bottom-center");
        setIsFavorite(wasFavorite);
      }
    } catch (err) {
      console.error("Favorite update failed", err);
      showError("Failed to update favorite status", 4000, "bottom-center");
      setIsFavorite(wasFavorite);
    }
  }, [isFavorite, productId, showSuccess, showError]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {images && images.length > 0 && (
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="aspect-w-4 aspect-h-3">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={title}
              className="w-full h-96 object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all z-10 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      )}
      {/* Thumbnail Images */}
      {images && images.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-eco-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
