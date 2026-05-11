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

export interface FindByUIDParams {
  userId: number;
  page?: number;        // current page (1-based)
  limit?: number;      // items per page
  search?: string;     // text search
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  condition?: string;
  sortBy?: 'latest' | 'price-asc' | 'price-desc';
};

export interface RawProduct {
  productid: number;
  title: string;
  description: string;
  price: number | string;
  originalprice?: number | string | null;
  categoryname: string;
  productcondition: string;
  images: string[] | null;
  distance?: number | string | null;
  userid: number | string;
  seller_name: string;
  rating?: number | string | null;
  isverified: boolean | number;
  profilepicture?: string | null;
  exchangetype: string;
};