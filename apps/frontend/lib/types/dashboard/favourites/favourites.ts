// types/favorite.ts
export interface FavoriteItem {
  id: string;
  item: {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    condition: 'excellent' | 'good' | 'fair';
    status: 'available' | 'sold' | 'reserved';
    exchangeType: 'sale' | 'exchange' | 'donation';
    seller: {
      id: string;
      name: string;
      avatar: string;
      rating: number;
      verified: boolean;
    };
    location: string;
    distance: number;
    views: number;
    createdAt: string;
  };
  addedAt: string;
}

export interface FavoriteStats {
  totalFavorites: number;
  availableItems: number;
  priceDrops: number;
  nearbyItems: number;
}