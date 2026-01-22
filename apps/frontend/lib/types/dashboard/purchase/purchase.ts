// types/purchase.ts
export interface Purchase {
  id: string;
  item: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    condition: 'excellent' | 'good' | 'fair';
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  status: 'completed' | 'cancelled' | 'disputed' | 'pending';
  purchaseDate: string;
  deliveredDate?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: 'jazzcash' | 'easypaisa' | 'cash';
  meetupLocation: string;
  latitude: number;
  longitude: number;
  rating?: number;
  review?: string;
}

export interface PurchaseStats {
  totalPurchases: number;
  totalSpent: number;
  completedOrders: number;
  pendingReviews: number;
}