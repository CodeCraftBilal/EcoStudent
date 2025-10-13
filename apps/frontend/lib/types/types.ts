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
  };
  exchangeType: "sale" | "exchange" | "donation";
}

export interface FilterState {
  showFilters?: boolean;
  category: string;
  priceRange: [number, number];
  condition: string[];
  exchangeType: string[];
  distance: number;
}
