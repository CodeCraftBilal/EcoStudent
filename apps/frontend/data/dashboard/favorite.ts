import { FavoriteItem } from "@/lib/types/dashboard/favourites/favourites";

export const mockFavoritesData: FavoriteItem[] = [
      {
        id: "1",
        item: {
          id: "item1",
          title: "Calculus Early Transcendentals 2nd Edition",
          description: "Like new condition, perfect for engineering students",
          price: 2500,
          originalPrice: 4000,
          image: "/imgshop/phybook.png",
          category: "books",
          condition: "excellent",
          status: "available",
          exchangeType: "sale",
          seller: {
            id: "seller1",
            name: "Ali Ahmed",
            avatar: "/ali.png",
            rating: 4.8,
            verified: true
          },
          location: "University Library",
          distance: 1.2,
          views: 24,
          createdAt: "2024-01-15"
        },
        addedAt: "2024-01-20"
      },
      {
        id: "2",
        item: {
          id: "item2",
          title: "Oxford University Uniform Set",
          description: "Complete uniform set with blazer and trousers",
          price: 1500,
          image: "/imgshop/oxforduniform.png",
          category: "uniform",
          condition: "good",
          status: "available",
          exchangeType: "sale",
          seller: {
            id: "seller2",
            name: "Sara Khan",
            avatar: "/api/placeholder/100/100",
            rating: 4.9,
            verified: true
          },
          location: "Student Center",
          distance: 2.5,
          views: 18,
          createdAt: "2024-01-10"
        },
        addedAt: "2024-01-18"
      },
      {
        id: "3",
        item: {
          id: "item3",
          title: "Scientific Calculator FX-991ES",
          description: "Casio scientific calculator, all functions working",
          price: 800,
          image: "/imgshop/calc.png",
          category: "calculator",
          condition: "excellent",
          status: "sold",
          exchangeType: "sale",
          seller: {
            id: "seller3",
            name: "Bilal Raza",
            avatar: "/api/placeholder/100/100",
            rating: 4.5,
            verified: false
          },
          location: "Engineering Building",
          distance: 0.8,
          views: 32,
          createdAt: "2024-01-08"
        },
        addedAt: "2024-01-16"
      },
      {
        id: "4",
        item: {
          id: "item4",
          title: "Geometry Box Complete Set",
          description: "Full geometry set with compass and protector",
          price: 300,
          image: "/imgshop/geomat.png",
          category: "geometry",
          condition: "good",
          status: "available",
          exchangeType: "exchange",
          seller: {
            id: "seller4",
            name: "Fatima Noor",
            avatar: "/api/placeholder/100/100",
            rating: 4.7,
            verified: true
          },
          location: "Science Block",
          distance: 3.1,
          views: 8,
          createdAt: "2024-01-18"
        },
        addedAt: "2024-01-19"
      },
      {
        id: "5",
        item: {
          id: "item5",
          title: "Physics Textbook Advanced",
          description: "Physics concepts and problems for college",
          price: 0,
          image: "/api/placeholder/300/200",
          category: "books",
          condition: "good",
          status: "available",
          exchangeType: "donation",
          seller: {
            id: "seller5",
            name: "Usman Ali",
            avatar: "/api/placeholder/100/100",
            rating: 4.6,
            verified: true
          },
          location: "Main Campus",
          distance: 1.8,
          views: 15,
          createdAt: "2024-01-16"
        },
        addedAt: "2024-01-17"
      }
    ];