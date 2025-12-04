"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  ProductImageGallery,
  ProductInfo,
  SellerInfo,
  ActionButtons,
  ProductTabs,
  RelatedItems
} from "@/components/shop/product";
import { ItemCard } from "@/components/shop/itemcard";
import { Item } from "@/lib/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { mockItems, mockReviews } from "@/data/Shop";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";
import { getUserLocation } from "@/lib/location";
import { filter } from "framer-motion/client";
// Mock data (same as before)
const mockItem = {
  id: "1",
  title: "Calculus Early Transcendentals 2nd Edition",
  description: "Like new condition, barely used. Perfect for engineering students.",
  detailedDescription: "This is the complete Calculus Early Transcendentals 2nd Edition textbook. It's in excellent condition with no highlights, underlines, or torn pages. Perfect for first-year engineering and mathematics students. Includes all chapters and supplemental materials.",
  price: 2500,
  originalPrice: 4000,
  category: "books",
  condition: "excellent" as const,
  images: [
    "/imgshop/calc.png",
    "/imgshop/phybook.png",
    "/api/placeholder/600/400",
    "/api/placeholder/600/400"
  ],
  distance: 1.2,
  rating: 4.8,
  reviewCount: 24,
  seller: {
    id: "user1",
    name: "Ali Ahmed",
    rating: 4.9,
    verified: true,
    memberSince: "2023",
    itemsSold: 47,
    responseRate: 98,
    avatar: "/api/placeholder/100/100"
  },
  exchangeType: "sale" as const,
  location: {
    address: "University of Mianwali, Main Campus",
    latitude: 32.5852,
    longitude: 71.5433
  },
  specifications: {
    "Author": "James Stewart",
    "Edition": "2nd Edition",
    "Publisher": "Cengage Learning",
    "ISBN": "978-1285741550",
    "Condition": "Like New",
    "Pages": "1368",
    "Language": "English"
  },
  postedDate: "2024-01-15",
  views: 156
};

const relatedItems: Item[] = mockItems;

export default function ProductDetailPage({ params }: { params: Promise<{ slug:string }>}) {

  const [item, setItem] = useState(null)
  useEffect(() => {
    const getProduct = async () => {
      const query: string[] = [];
      const userLocation = await getUserLocation();
      const {slug} = await params;
      console.log('slug ', slug[0])

      if(userLocation) {
        query.push(`lat=${userLocation.latitude}&lng=${userLocation.longitude}`)
      }

      const filters = query.join('&')
      try {
        const res = await authFetch(`${BACKEND_URL}/product/${slug}?${filters}`)
        if(!res.ok) return;

        const result = await res.json();
        console.log('result item: ', result)
      }
      catch(err) {
        console.log(`Failed to fetch Product `, err)
      }
    }

    getProduct();
  }, [])
  
  // related items state
  const [isFavorite, setIsFavorite] = useState(false);
  const [cart, setCart] = useState<Set<string>>(new Set());

  // toogle favorite
  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (itemId: string) => {
    const newCart = new Set(cart);
    if (newCart.has(itemId)) {
      newCart.delete(itemId);
    } else {
      newCart.add(itemId);
    }
    setCart(newCart);
  };

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    console.log("Share product:", mockItem.title);
    // Implement share functionality
  };

  const handleReport = () => {
    console.log("Report product:", mockItem.id);
    // Implement report functionality
  };

  const handleAddToCart = (quantity: number) => {
    console.log(`Added ${quantity} of ${mockItem.title} to cart`);
    // Implement add to cart functionality
  };

  const handleMessageSeller = () => {
    console.log(`Message seller: ${mockItem.seller.name}`);
    // Implement message seller functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/shop" 
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery
              images={mockItem.images}
              title={mockItem.title}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <ProductInfo
              title={mockItem.title}
              description={mockItem.description}
              detailedDescription={mockItem.detailedDescription}
              price={mockItem.price}
              originalPrice={mockItem.originalPrice}
              rating={mockItem.rating}
              reviewCount={mockItem.reviewCount}
              condition={mockItem.condition}
              exchangeType={mockItem.exchangeType}
              postedDate={mockItem.postedDate}
              views={mockItem.views}
              onShare={handleShare}
              onReport={handleReport}
            />

            <SellerInfo
              seller={mockItem.seller}
              distance={mockItem.distance}
              onMessageSeller={handleMessageSeller}
            />

            {/* <ActionButtons
              exchangeType={mockItem.exchangeType}
              price={mockItem.price}
              onAddToCart={handleAddToCart}
              onMessageSeller={handleMessageSeller}
            /> */}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <ProductTabs
            description={mockItem.detailedDescription}
            specifications={mockItem.specifications}
            reviews={mockReviews}
            location={mockItem.location}
            distance={mockItem.distance}
          />
        </div>

        {/* Related Items */}
        <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {relatedItems.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  isFavorite={favorites.has(item.id)}
                  isInCart={cart.has(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCart={toggleCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
      </div>
    </div>
  );
}