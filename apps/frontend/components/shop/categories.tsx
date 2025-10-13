"use client";

import { Book, Shirt, Calculator, Ruler, Briefcase, Zap } from "lucide-react";
import { JSX } from "react";

interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
}

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const categoriesData: Category[] = [
  { id: "all", name: "All Items", icon: <Zap className="w-5 h-5" />, color: "bg-gradient-to-r from-green-500 to-blue-500" },
  { id: "books", name: "Books", icon: <Book className="w-5 h-5" />, color: "bg-gradient-to-r from-green-500 to-teal-500" },
  { id: "uniform", name: "Uniforms", icon: <Shirt className="w-5 h-5" />, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
  { id: "calculator", name: "Calculators", icon: <Calculator className="w-5 h-5" />, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "geometry", name: "Geometry", icon: <Ruler className="w-5 h-5" />, color: "bg-gradient-to-r from-orange-500 to-red-500" },
  { id: "bag", name: "Bags", icon: <Briefcase className="w-5 h-5" />, color: "bg-gradient-to-r from-yellow-500 to-orange-500" }
];

export function Categories({ selectedCategory, onCategorySelect }: CategoriesProps) {
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {categoriesData.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? `${category.color} text-white shadow-lg`
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}