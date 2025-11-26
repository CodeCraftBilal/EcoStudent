"use client";

import { useState, useEffect } from "react";
import { Search} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState, Item } from "@/lib/types/types";
import { ShopNavBar } from "@/components/shop/header";
import { Categories } from "@/components/shop/categories";
import { ItemCard } from "@/components/shop/itemcard";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/types/constants";

// Mock data
const mockItems: Item[] = [
  {
    id: "1",
    title: "Calculus Early Transcendentals",
    description: "Like new condition, barely used. Perfect for engineering students.",
    price: 2500,
    originalPrice: 4000,
    category: "books",
    condition: "excellent",
    image: "/calculusbook.jpg",
    distance: 1.2,
    rating: 4.8,
    seller: {
      name: "Ali Ahmed",
      rating: 4.9,
      verified: true
    },
    exchangeType: "sale"
  },
  {
    id: "2",
    title: "Oxford University Uniform",
    description: "Complete set with blazer, trousers, and tie. Size medium.",
    price: 1500,
    category: "uniform",
    condition: "good",
    image: "/imgshop/oxforduniform.png",
    distance: 2.5,
    rating: 4.5,
    seller: {
      name: "Sara Khan",
      rating: 4.7,
      verified: true
    },
    exchangeType: "sale"
  },
  {
    id: "3",
    title: "Scientific Calculator FX-991ES",
    description: "Casio scientific calculator with all functions working perfectly.",
    price: 800,
    category: "calculator",
    condition: "excellent",
    image: "/imgshop/calc.png",
    distance: 0.8,
    rating: 4.9,
    seller: {
      name: "Bilal Raza",
      rating: 5.0,
      verified: false
    },
    exchangeType: "exchange"
  },
  {
    id: "4",
    title: "Geometry Box Set",
    description: "Full geometry set with compass, protector, and ruler.",
    price: 300,
    category: "geometry",
    condition: "good",
    image: "/imgshop/geomat.png",
    distance: 3.1,
    rating: 4.3,
    seller: {
      name: "Fatima Noor",
      rating: 4.4,
      verified: true
    },
    exchangeType: "sale"
  },
  {
    id: "5",
    title: "School Bag Backpack",
    description: "Waterproof school backpack with laptop compartment.",
    price: 1200,
    category: "bag",
    condition: "fair",
    image: "/imgshop/bag.png",
    distance: 1.8,
    rating: 4.2,
    seller: {
      name: "Usman Ali",
      rating: 4.6,
      verified: true
    },
    exchangeType: "sale"
  },
  {
    id: "6",
    title: "Physics Textbook Advanced",
    description: "Physics concepts and problems for college students.",
    price: 0,
    category: "books",
    condition: "good",
    image: "/imgshop/phybook.png",
    distance: 4.2,
    rating: 4.6,
    seller: {
      name: "Ayesha Malik",
      rating: 4.8,
      verified: true
    },
    exchangeType: "donation"
  },
  {
    id: "11",
    title: "Casio FX-991EX Scientific Calculator",
    description: "Advanced scientific calculator suitable for engineering and science students.",
    price: 4500,
    originalPrice: 6000,
    category: "Electronics",
    condition: "excellent",
    image: "/images/calculator.jpg",
    distance: 2.5,
    rating: 4.8,
    seller: {
      name: "Ali Raza",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "12",
    title: "Data Structures and Algorithms Book",
    description: "Comprehensive guide for computer science students with C++ examples.",
    price: 1200,
    category: "Books",
    condition: "good",
    image: "/images/dsa-book.jpg",
    distance: 4.2,
    rating: 4.6,
    seller: {
      name: "Hassan Ahmad",
      rating: 4.7,
      verified: false,
    },
    exchangeType: "exchange",
  },
  {
    id: "13",
    title: "Engineering Drawing Set",
    description: "Complete drawing set including compass, divider, protractor, and scale for engineering students.",
    price: 800,
    originalPrice: 1000,
    category: "Stationery",
    condition: "excellent",
    image: "/images/drawing-set.jpg",
    distance: 1.8,
    rating: 4.5,
    seller: {
      name: "Fatima Noor",
      rating: 4.8,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "14",
    title: "Arduino Starter Kit",
    description: "Perfect for beginners learning electronics and programming with Arduino.",
    price: 5500,
    originalPrice: 6500,
    category: "Electronics",
    condition: "good",
    image: "/images/arduino-kit.jpg",
    distance: 3.1,
    rating: 4.9,
    seller: {
      name: "Muhammad Bilal",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "15",
    title: "Laptop Backpack",
    description: "Durable water-resistant backpack with laptop compartment and multiple pockets for students.",
    price: 2000,
    category: "Accessories",
    condition: "excellent",
    image: "/images/backpack.jpg",
    distance: 5.4,
    rating: 4.4,
    seller: {
      name: "Sara Khan",
      rating: 4.6,
      verified: false,
    },
    exchangeType: "sale",
  },
  {
    id: "16",
    title: "Whiteboard with Markers",
    description: "Portable whiteboard perfect for study rooms or home learning setup.",
    price: 1500,
    category: "Study Material",
    condition: "good",
    image: "/images/whiteboard.jpg",
    distance: 6.0,
    rating: 4.3,
    seller: {
      name: "Aqeel Rehman",
      rating: 4.7,
      verified: true,
    },
    exchangeType: "donation",
  },
  {
    id: "17",
    title: "Programming Laptop (Dell Latitude 7490)",
    description: "Used laptop with Core i5, 8GB RAM, SSD — ideal for students and developers.",
    price: 65000,
    originalPrice: 80000,
    category: "Laptops",
    condition: "good",
    image: "/images/dell-laptop.jpg",
    distance: 2.0,
    rating: 4.9,
    seller: {
      name: "Zain Malik",
      rating: 4.8,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "18",
    title: "Mathematics Formula Chart",
    description: "Large laminated math formula sheet for quick revision before exams.",
    price: 300,
    category: "Posters",
    condition: "excellent",
    image: "/images/math-chart.jpg",
    distance: 1.2,
    rating: 4.2,
    seller: {
      name: "Anam Javed",
      rating: 4.4,
      verified: false,
    },
    exchangeType: "donation",
  },
  {
    id: "19",
    title: "Mechanical Keyboard for Coding",
    description: "RGB backlit mechanical keyboard for smooth typing experience while programming.",
    price: 7500,
    category: "Electronics",
    condition: "excellent",
    image: "/images/keyboard.jpg",
    distance: 3.7,
    rating: 4.8,
    seller: {
      name: "Hamza Tariq",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "20",
    title: "Python Programming Notebook",
    description: "Well-maintained handwritten notes covering Python basics to advanced topics.",
    price: 700,
    category: "Notes",
    condition: "fair",
    image: "/images/python-notes.jpg",
    distance: 4.8,
    rating: 4.1,
    seller: {
      name: "Nimra Aslam",
      rating: 4.3,
      verified: false,
    },
    exchangeType: "exchange",
  },
];

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 5000],
    condition: [],
    exchangeType: [],
    distance: 10
  });

  // Apply filters
  useEffect(() => {
    const getAllItems = async () => {
      const res = await authFetch(`${BACKEND_URL}/product`);
      if(!res.ok) {
        console.log(res.status, res.statusText);
      }

      const result = await res.json();
      console.log(result)

      let filtered = mockItems;
      console.log('mockItems ', mockItems)
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Price filter
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    // Condition filter
    if (filters.condition.length > 0) {
      filtered = filtered.filter(item => filters.condition.includes(item.condition));
    }

    // Exchange type filter
    if (filters.exchangeType.length > 0) {
      filtered = filtered.filter(item => filters.exchangeType.includes(item.exchangeType));
    }

    // Distance filter
    filtered = filtered.filter(item => item.distance <= filters.distance);

    setItems(filtered);
    }

    getAllItems()
    
  }, [filters, searchQuery]);

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

  const resetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 5000],
      condition: [],
      exchangeType: [],
      distance: 10
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with Search */}
      <ShopNavBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        cartCount={cart.size}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={resetFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Categories */}
        <Categories 
          selectedCategory={filters.category}
          onCategorySelect={(category) => setFilters(prev => ({ ...prev, category }))} categories={[]}        />

        {/* Results Count and Sort */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">
            Showing {items.length} of {mockItems.length} items
          </p>
          <div className="flex space-x-4">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Sort by: Newest</option>
              <option>Sort by: Price Low to High</option>
              <option>Sort by: Price High to Low</option>
              <option>Sort by: Distance</option>
              <option>Sort by: Rating</option>
            </select>
          </div>
        </div>

        {/* Items Grid - 2 columns on mobile, responsive on larger screens */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={resetFilters}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {items.map((item, index) => (
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
        )}
      </div>

      {/* Chat Component */}
      {/* <div className="bg-transparent">
      <Chat showChat={showChat} setShowChat={setShowChat} draggable={true}/>
      </div> */}
    </div>
  );
}                   