import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  distance: number;
  rating: number;
  seller: {
    name: string;
    avatar: string;
  };
  exchangeType: "sale" | "exchange" | "donation";
}

interface RelatedItemsProps {
  items: Item[];
}

export default function RelatedItems({ items }: RelatedItemsProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link key={item.id} href={`/shop/product/${item.id}`}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.exchangeType === "sale" ? "bg-green-100 text-green-800" :
                    item.exchangeType === "exchange" ? "bg-blue-100 text-blue-800" :
                    "bg-purple-100 text-purple-800"
                  }`}>
                    {item.exchangeType === "sale" ? "For Sale" :
                     item.exchangeType === "exchange" ? "For Exchange" : "Free"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    Rs {item.price.toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{item.distance} km</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-700">{item.seller.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}