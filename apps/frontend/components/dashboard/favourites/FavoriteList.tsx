"use client";

import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "@/components/shop/itemcard";
import { Item } from "@/lib/types/types";

interface FavoriteListProps {
  favorites: Item[];
  onRemoveFavorite: (favoriteId: string) => void;
  onAddToCart: (itemId: string) => void;
}

export default function FavoriteList({
  favorites,
  onRemoveFavorite
}: FavoriteListProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {favorites.map((favorite, index) => (
          <motion.div
            key={favorite.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
          >
            <ItemCard
              item={favorite}
              index={index}
              isFavorite={true}
              onToggleFavorite={onRemoveFavorite}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
