interface FavoriteItem {
  favoriteId: string;
  addedAt: string;
  status: 'active' | 'sold' | 'reserved' | 'draft';
  location: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "books" | "bags" | "uniform" | "calculator" | "geomatry" | "other";
  condition: "excellent" | "good" | "fair";
  image: string;
  distance: number;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    profilePicture?: string;
  };
  exchangeType: "sale" | "exchange" | "donation";
  favorite?: FavoriteItem
}


export interface FilterState {
  showFilters?: boolean;
  category: string;
  priceRange: [number, number];
  condition: string[];
  exchangeType: string[];
  distance: number;
}

export interface Notification {
    id: string;
    type: "message" | "sale" | "review" | 'purchase' | 'listing' | "other";
    title: string;
    message: string;
    time: string;
    read: boolean;
    link: string;
}