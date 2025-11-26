// Add to your types file
export interface BackendProduct {
  productId: number;
  title: string;
  description: string | null;
  price: number | null;
  originalPrice: number | null;
  productCondition: "excellent" | "good" | "fair";
  productType: string;
  images: string[] | null;
  category: {
    categoryName: string;
  };
  users: {
    userName: string;
    rating: number | null;
    isVerified: boolean | null;
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