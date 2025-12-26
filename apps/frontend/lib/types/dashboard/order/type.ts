// lib/types/orders.ts
export interface Order {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  agreedPrice: number;
  meetupLocation: string;
  meetupLatitude: number;
  meetupLongitude: number;
  meetupTime: string;
  createdAt: string;
  product?: {
    id: number;
    title: string;
    price: number;
    images: string[];
    userId: number;
  };
  buyer?: {
    id: number;
    name: string;
    email: string;
  };
  seller?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateOrderDto {
  productId: number;
  agreedPrice: number;
  meetupLocation: string;
  meetupLatitude: number;
  meetupLongitude: number;
  meetupTime: string;
}