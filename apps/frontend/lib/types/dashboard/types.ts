// types/dashboard.ts
export interface DashboardStats {
  itemsForSale: number;
  itemsSold: number;
  totalEarnings: number;
  unreadMessages: number;
  itemsBought: number;
  positiveReviews: number;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  status: 'active' | 'sold' | 'reserved' | 'draft';
  views: number;
  createdAt: string;
  category: string;
}

export interface Activity {
  id: string;
  type: 'message' | 'sale' | 'purchase' | 'review' | 'listing';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface UploadItemData {
  originalPrice: any;
  title: string;
  description: string;
  price: string;
  orignalPrice: string;
  category: string;
  subCategory?: string;
  condition: 'excellent' | 'good' | 'fair';
  exchangeType: 'sale' | 'exchange' | 'donation';
  images: File[];
}