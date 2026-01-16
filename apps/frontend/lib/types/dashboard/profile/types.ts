// types/profile.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location: string;
  latitude?: number;
  longitude?: number;
  userType: 'student' | 'teacher' | 'alumni' | 'other';
  institution?: string;
  course?: string;
  semester?: string;
  joinDate: string;
  isVerified: boolean;
}

export interface ProfileStats {
  totalListings: number;
  itemsSold: number;
  itemsBought: number;
  totalEarnings: number;
  rating: number;
  reviewsCount: number;
}