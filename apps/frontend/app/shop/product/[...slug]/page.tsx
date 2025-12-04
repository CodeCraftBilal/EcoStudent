"use client";

import { useState } from "react";
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
import { mockItems } from "@/data/Shop";

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

const mockReviews = [
  {
    id: "rev1",
    user: {
      name: "Sarah Khan",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 5,
    comment: "The book was in perfect condition, just as described. Seller was very professional and punctual. Highly recommended!",
    date: "2024-01-20",
    helpful: 12
  },
  {
    id: "rev2",
    user: {
      name: "Ali Raza",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 4,
    comment: "Fast delivery and good packaging. The book had a few pencil marks but overall great value for money.",
    date: "2024-02-10",
    helpful: 8
  },
  {
    id: "rev3",
    user: {
      name: "Hina Malik",
      avatar: "/api/placeholder/50/50",
      verified: false
    },
    rating: 5,
    comment: "Exactly what I needed for my course. Seller responded quickly and was very cooperative.",
    date: "2024-03-15",
    helpful: 15
  },
  {
    id: "rev4",
    user: {
      name: "Usman Ahmed",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 3,
    comment: "Book was slightly worn out from the edges but readable. Could improve packaging.",
    date: "2024-04-02",
    helpful: 5
  },
  {
    id: "rev5",
    user: {
      name: "Zara Fatima",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 5,
    comment: "Amazing experience! The seller kept me updated and the quality was superb. Would buy again.",
    date: "2024-05-21",
    helpful: 22
  },
  {
    id: "rev6",
    user: {
      name: "Hamza Sheikh",
      avatar: "/api/placeholder/50/50",
      verified: false
    },
    rating: 4,
    comment: "Good deal for the price. Some pages were slightly folded but overall it’s a great purchase.",
    date: "2024-06-18",
    helpful: 7
  },
  {
    id: "rev7",
    user: {
      name: "Maryam Ali",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 5,
    comment: "Seller was kind and responsive. The book looked brand new and arrived earlier than expected.",
    date: "2024-07-05",
    helpful: 19
  },
  {
    id: "rev8",
    user: {
      name: "Bilal Khan",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 2,
    comment: "Book was missing a few pages. Seller apologized but refund took a while.",
    date: "2024-08-14",
    helpful: 3
  },
  {
    id: "rev9",
    user: {
      name: "Ayesha Noor",
      avatar: "/api/placeholder/50/50",
      verified: false
    },
    rating: 4,
    comment: "The content of the book was excellent. Some wear on the cover but acceptable for the price.",
    date: "2024-09-03",
    helpful: 11
  },
  {
    id: "rev10",
    user: {
      name: "Farhan Iqbal",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 5,
    comment: "Perfectly described and delivered. This seller knows how to maintain trust!",
    date: "2024-10-11",
    helpful: 14
  },
  {
    id: "rev11",
    user: {
      name: "Noor Hassan",
      avatar: "/api/placeholder/50/50",
      verified: true
    },
    rating: 4,
    comment: "Good communication, fair price, and book in decent shape. Would recommend to others.",
    date: "2024-11-01",
    helpful: 9
  }
];

const relatedItems: Item[] = mockItems;

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  
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