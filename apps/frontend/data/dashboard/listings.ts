import { Listing } from "@/lib/types/dashboard/listings/listings";

export const mockListingsData: Listing[] = [
      {
        id: "1",
        title: "Calculus Early Transcendentals 2nd Edition",
        description: "Like new condition, perfect for engineering students",
        price: 2500,
        originalPrice: 4000,
        image: "/imgshop/phybook.png",
        status: "active",
        category: "books",
        condition: "excellent",
        views: 24,
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
        exchangeType: "sale"
      },
      {
        id: "2",
        title: "Oxford University Uniform Set",
        description: "Complete uniform set with blazer and trousers",
        price: 1500,
        image: "/imgshop/oxforduniform.png",
        status: "sold",
        category: "uniform",
        condition: "good",
        views: 18,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-12",
        exchangeType: "sale"
      },
      {
        id: "3",
        title: "Scientific Calculator FX-991ES",
        description: "Casio scientific calculator, all functions working",
        price: 800,
        image: "/imgshop/calc.png",
        status: "reserved",
        category: "calculator",
        condition: "excellent",
        views: 32,
        createdAt: "2024-01-08",
        updatedAt: "2024-01-14",
        exchangeType: "sale"
      },
      {
        id: "4",
        title: "Geometry Box Complete Set",
        description: "Full geometry set with compass and protector",
        price: 300,
        image: "/imgshop/geomat.png",
        status: "active",
        category: "geometry",
        condition: "good",
        views: 8,
        createdAt: "2024-01-18",
        updatedAt: "2024-01-18",
        exchangeType: "exchange"
      },
      {
        id: "5",
        title: "School Backpack Waterproof",
        description: "Waterproof backpack with laptop compartment",
        price: 1200,
        image: "/imgshop/bag.png",
        status: "draft",
        category: "bag",
        condition: "fair",
        views: 0,
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
        exchangeType: "sale"
      },
      {
        id: "6",
        title: "Physics Textbook Advanced",
        description: "Physics concepts and problems for college",
        price: 0,
        image: "/imgshop/phybook.png",
        status: "active",
        category: "books",
        condition: "good",
        views: 15,
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16",
        exchangeType: "donation"
      }
      // ... other mock listings
    ];