export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  status: "active" | "sold" | "reserved" | "draft";
  category: string;
  condition: "excellent" | "good" | "fair";
  views: number;
  createdAt: string;
  updatedAt: string;
  exchangeType: "sale" | "exchange" | "donation";
}

export interface ListingStats {
  totalCount: number;
  activeCount: number;
  soldCount: number;
  draftCount: number;
  reservedCount: number;
}
