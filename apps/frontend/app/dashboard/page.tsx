"use client";

import { DashboardLayout } from "@/components/dashboard";
import { DashboardLoader } from "@/components/Loading";
import { useSession } from "@/context/useSession";
import { DashboardStats, Listing, Activity } from "@/lib/types/dashboard/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { mockListings, mockActivities } from "@/data/dashboard/dashboard";

// Mock data
const mockStats: DashboardStats = {
  itemsForSale: 5,
  itemsSold: 12,
  totalEarnings: 18500,
  unreadMessages: 3,
  itemsBought: 8,
  positiveReviews: 15,
};


export default function DashboardPage() {
  const params = useSearchParams();
  //
  const userId = params.get("userId");
  const userName = params.get("userName");
  const role = params.get("role");
  const email = params.get("email");
  const profile = params.get("profilePicture");

  const router = useRouter();
  const { session, isLoading } = useSession();
  

  useEffect(() => {
    console.log('dashboard ')
    if (!session && !isLoading) {
      router.push("/auth/signin");
    }
  }, [isLoading, session, router]);

  if (isLoading) return <DashboardLoader />
  if (!session) return null;
  return (
    <DashboardLayout
      userName="Ali Student"
      stats={mockStats}
      listings={mockListings}
      activities={mockActivities}
    />
  );
}
