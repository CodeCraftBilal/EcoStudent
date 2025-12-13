"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import {
  ProductImageGallery,
  ProductInfo,
  SellerInfo,
  ProductTabs,
} from "@/components/shop/product";
import ItemCard from "@/components/shop/itemcard";
import { LoadingSpinner } from "@/components/Loading";
import { ProductNotFound } from "@/components/shop/product/NotFound";

import { BACKEND_URL, FRONTEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";
import { getUserLocation } from "@/lib/location";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  condition: string;
  images: string[];
  postedDate: string;
  views: number;
  category: string;
  distance: number;
  exchangeType: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    reviewCount: number;
    memberSince: string;
    avatar: string;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  specifications?: Record<string, string>;
};

export type Review = {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const searchParams = useSearchParams();
  // loading more items on scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /** -----------------------------------------------------
   *  FETCH PRODUCT DATA (runs once)
   * ------------------------------------------------------ */
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      const { slug } = await params;
      const location = await getUserLocation();

      let query = [];
      if (location)
        query.push(`lat=${location.latitude}&lng=${location.longitude}`);

      try {
        const res = await authFetch(
          `${BACKEND_URL}/product/${slug}?${query.join("&")}`
        );

        if (!res.ok) return;

        const data = await res.json();
        if (!data.error && data[0]) {
          setProduct(data[0]);
        }
      } catch (e) {
        console.log("Error fetching product", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  /** -----------------------------------------------------
   *  FETCH REVIEWS
   * ------------------------------------------------------ */
  useEffect(() => {
    if (!product) return;

    const fetchReviews = async () => {
      try {
        const res = await authFetch(
          `${BACKEND_URL}/review/${product.seller.id}`
        );
        if (!res.ok) return setReviews(null);

        const data = await res.json();
        setReviews(!data.error ? data : null);
      } catch (e) {
        console.log("Error fetching reviews", e);
      }
    };

    fetchReviews();
  }, [product]);

  /** -----------------------------------------------------
   *  FAVORITES & CART TOGGLE (memoized functions)
   * ------------------------------------------------------ */
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  const toggleCart = useCallback((id: string) => {
    setCart((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  /** -----------------------------------------------------
   *  FETCH RELATED PRODUCTS (stable function)
   * ------------------------------------------------------ */
  const fetchRelatedProducts = useCallback(
    async ({ pageParam = 0 }) => {
      const location = await getUserLocation();
      let query: string[] = [];

      if (location)
        query.push(`lat=${location.latitude}&lng=${location.longitude}`);

      const category = searchParams.get("category");
      if (category) query.push(`category=${category}`);

      query.push("minPrice=0", "maxPrice=5000");
      query.push(`offset=${pageParam}`, `limit=12`);
      query.push(`maxDistance=20`);

      const res = await authFetch(`${BACKEND_URL}/product?${query.join("&")}`);
      return res.json();
    },
    [searchParams]
  );

  /** -----------------------------------------------------
   *  useInfiniteQuery (perfect setup)
   * ------------------------------------------------------ */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["related-products"],
      queryFn: fetchRelatedProducts,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length < 12 ? undefined : pages.length * 12,
    });

  /** -----------------------------------------------------
   *  Flatten related items (memoized)
   * ------------------------------------------------------ */
  const relatedItems = useMemo(() => data?.pages.flat() ?? [], [data]);

  // infite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loadMoreRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /** -----------------------------------------------------
   *  RENDER
   * ------------------------------------------------------ */
  if (isLoading)
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!product) return <ProductNotFound />;

  function handleShare(): void {
    throw new Error("Function not implemented.");
  }

  function handleReport(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href={`${FRONTEND_URL}/${searchParams.get('from') || 'shop'}`} className="flex items-center text-green-600">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ProductImageGallery
            images={product.images}
            title={product.title}
            isFavorite={favorites.has(product.id)}
            onFavoriteToggle={() => toggleFavorite(product.id)}
          />

          <div className="space-y-6">
            <ProductInfo
              title={product.title}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.seller.rating}
              reviewCount={product.seller.reviewCount}
              condition={product.condition}
              exchangeType={product.exchangeType}
              postedDate={product.postedDate}
              views={product.views}
              onShare={handleShare}
              onReport={handleReport}
            />

            <SellerInfo seller={product.seller} distance={product.distance} />
          </div>
        </div>

        {reviews && (
          <ProductTabs
            description={product.description}
            specifications={product.specifications}
            reviews={reviews}
            location={product.location}
            distance={product.distance}
          />
        )}

        {/* RELATED ITEMS */}
        {/* RELATED ITEMS WITH INFINITE SCROLL */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {relatedItems.map((item, idx) => {
              const isLast = idx === relatedItems.length - 1;

              return (
                <div
                  key={item.id}
                  ref={isLast ? loadMoreRef : null} // 👈 attach observer to last item
                >
                  <ItemCard
                    item={item}
                    index={idx}
                    isFavorite={favorites.has(item.id)}
                    isInCart={cart.has(item.id)}
                    onToggleFavorite={toggleFavorite}
                    onToggleCart={toggleCart}
                  />
                </div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
