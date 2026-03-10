"use client";
import React from "react";
import { FRONTEND_URL } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ProductNav = () => {
  const searchParams = useSearchParams();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        <Link
          href={`${FRONTEND_URL}/${searchParams ? searchParams.get("from") : "shop"}`}
          className="flex items-center text-green-600"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </div>
    </nav>
  );
};

export default ProductNav;
