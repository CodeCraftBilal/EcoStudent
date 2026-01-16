"use client";

import { DashboardLayout } from "@/components/dashboard";
import { DashboardLoader } from "@/components/Loading";
import { useSession } from "@/context/useSession";
import { DashboardStats, Listing, Activity } from "@/lib/types/dashboard/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mockListings, mockActivities } from "@/data/dashboard/dashboard";
import { authFetch } from "@/lib/authFetch";

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
  const [stats, setStats] = useState<DashboardStats>({
    itemsForSale: 0,
    itemsSold: 0,
    totalEarnings: 0,
    unreadMessages: 0,
    itemsBought: 0,
    positiveReviews: 0,
  });

  useEffect(() => {
    console.log("dashboard ");
    if (!session && !isLoading) {
      router.push("/auth/signin");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/dashboard/stats`
        );
        if (!res.ok) throw new Error("Unable to dashbaord stats");

        const result = await res.json();
        setStats(result);
        console.log(result);
      } catch (err) {
        console.error("Dashboard Stats Error ", err);
      }
    };

    fetchStats();
    return () => {};
  }, []);

  if (isLoading) return <DashboardLoader />;
  if (!session) return null;
  return (
    <DashboardLayout
      userName="Ali Student"
      stats={stats}
      listings={mockListings}
      activities={mockActivities}
    />
  );
}
