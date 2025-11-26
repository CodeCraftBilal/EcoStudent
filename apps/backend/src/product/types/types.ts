export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: "excellent" | "good" | "fair";
  image: string;
  distance: number;
  rating: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    profilePicture?: string;
  };
  exchangeType: "sale" | "exchange" | "donation";
}

// Extended filter interface for backend
export interface BackendFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[] | string;
  exchangeType?: string[] | string;
  // Add location filters when implemented
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
}