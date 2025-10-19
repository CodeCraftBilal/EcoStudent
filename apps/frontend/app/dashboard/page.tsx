"use client";

import { DashboardLayout } from "@/components/dashboard";
import { DashboardStats, Listing, Activity } from "@/lib/types/dashboard/types";

// Mock data
const mockStats: DashboardStats = {
  itemsForSale: 5,
  itemsSold: 12,
  totalEarnings: 18500,
  unreadMessages: 3,
  itemsBought: 8,
  positiveReviews: 15
};

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Calculus Early Transcendentals",
    price: 2500,
    image: "/api/placeholder/80/80",
    status: "active",
    views: 24,
    createdAt: "2024-01-15",
    category: "books"
  },
  {
    id: "2",
    title: "Oxford University Uniform",
    price: 1500,
    image: "/api/placeholder/80/80",
    status: "reserved",
    views: 18,
    createdAt: "2024-01-10",
    category: "uniform"
  },
  {
    id: "3",
    title: "Scientific Calculator FX-991ES",
    price: 800,
    image: "/api/placeholder/80/80",
    status: "sold",
    views: 32,
    createdAt: "2024-01-05",
    category: "calculator"
  },
  {
    id: "4",
    title: "Geometry Box Set",
    price: 300,
    image: "/api/placeholder/80/80",
    status: "active",
    views: 8,
    createdAt: "2024-01-18",
    category: "geometry"
  },
  {
    id: "5",
    title: "School Backpack",
    price: 1200,
    image: "/api/placeholder/80/80",
    status: "draft",
    views: 0,
    createdAt: "2024-01-20",
    category: "bag"
  }
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "message",
    title: "New Message from Ali",
    description: "Is the Calculus book still available?",
    time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    read: false
  },
  {
    id: "2",
    type: "sale",
    title: "Item Sold",
    description: "Your Scientific Calculator was purchased",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true
  },
  {
    id: "3",
    type: "review",
    title: "New Review Received",
    description: "Sara gave you 5 stars for the uniform",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true
  },
  {
    id: "4",
    type: "purchase",
    title: "Purchase Completed",
    description: "You bought Physics Textbook from Bilal",
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true
  }
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      userName="Ali Student"
      stats={mockStats}
      listings={mockListings}
      activities={mockActivities}
    />
  );
}