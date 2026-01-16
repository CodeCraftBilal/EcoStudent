
import { Item } from "@/lib/types/types";

export const mockItems: Item[] = [
  {
    id: "1",
    title: "Calculus Early Transcendentals",
    description:
      "Like new condition, barely used. Perfect for engineering students.",
    price: 2500,
    originalPrice: 4000,
    category: "books",
    condition: "excellent",
    image: "/calculusbook.jpg",
    distance: 1.2,
    rating: 4.8,
    seller: {
      id: '3',
      name: "Ali Ahmed",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
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
      id: '3',
      name: "Sara Khan",
      rating: 4.7,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "3",
    title: "Scientific Calculator FX-991ES",
    description:
      "Casio scientific calculator with all functions working perfectly.",
    price: 800,
    category: "calculator",
    condition: "excellent",
    image: "/imgshop/calc.png",
    distance: 0.8,
    rating: 4.9,
    seller: {
      id: '3',
      name: "Bilal Raza",
      rating: 5.0,
      verified: false,
    },
    exchangeType: "exchange",
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
      id: '3',
      name: "Fatima Noor",
      rating: 4.4,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "5",
    title: "School Bag Backpack",
    description: "Waterproof school backpack with laptop compartment.",
    price: 1200,
    category: "bags",
    condition: "fair",
    image: "/imgshop/bag.png",
    distance: 1.8, 
    seller: {
      id: '3',
      name: "Usman Ali",
      rating: 4.6,
      verified: true,
    },
    exchangeType: "sale",
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
    seller: {
      id: '3',
      name: "Ayesha Malik",
      rating: 4.8,
      verified: true,
    },
    exchangeType: "donation",
  },
  {
    id: "11",
    title: "Casio FX-991EX Scientific Calculator",
    description:
      "Advanced scientific calculator suitable for engineering and science students.",
    price: 4500,
    originalPrice: 6000,
    category: "Electronics",
    condition: "excellent",
    image: "/images/calculator.jpg",
    distance: 2.5,
    rating: 4.8,
    seller: {
      id: '3',
      name: "Ali Raza",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "12",
    title: "Data Structures and Algorithms Book",
    description:
      "Comprehensive guide for computer science students with C++ examples.",
    price: 1200,
    category: "Books",
    condition: "good",
    image: "/images/dsa-book.jpg",
    distance: 4.2,
    rating: 4.6,
    seller: {
      id: '3',
      name: "Hassan Ahmad",
      rating: 4.7,
      verified: false,
    },
    exchangeType: "exchange",
  },
  {
    id: "13",
    title: "Engineering Drawing Set",
    description:
      "Complete drawing set including compass, divider, protractor, and scale for engineering students.",
    price: 800,
    originalPrice: 1000,
    category: "Stationery",
    condition: "excellent",
    image: "/images/drawing-set.jpg",
    distance: 1.8,
    rating: 4.5,
    seller: {
      id: '3',
      name: "Fatima Noor",
      rating: 4.8,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "14",
    title: "Arduino Starter Kit",
    description:
      "Perfect for beginners learning electronics and programming with Arduino.",
    price: 5500,
    originalPrice: 6500,
    category: "Electronics",
    condition: "good",
    image: "/images/arduino-kit.jpg",
    distance: 3.1,
    rating: 4.9,
    seller: {
      id: '3',
      name: "Muhammad Bilal",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "15",
    title: "Laptop Backpack",
    description:
      "Durable water-resistant backpack with laptop compartment and multiple pockets for students.",
    price: 2000,
    category: "Accessories",
    condition: "excellent",
    image: "/images/backpack.jpg",
    distance: 5.4,
    rating: 4.4,
    seller: {
      id: '3',
      name: "Sara Khan",
      rating: 4.6,
      verified: false,
    },
    exchangeType: "sale",
  },
  {
    id: "16",
    title: "Whiteboard with Markers",
    description:
      "Portable whiteboard perfect for study rooms or home learning setup.",
    price: 1500,
    category: "Study Material",
    condition: "good",
    image: "/images/whiteboard.jpg",
    distance: 6.0,
    rating: 4.3,
    seller: {
      id: '3',
      name: "Aqeel Rehman",
      rating: 4.7,
      verified: true,
    },
    exchangeType: "donation",
  },
  {
    id: "17",
    title: "Programming Laptop (Dell Latitude 7490)",
    description:
      "Used laptop with Core i5, 8GB RAM, SSD — ideal for students and developers.",
    price: 65000,
    originalPrice: 80000,
    category: "Laptops",
    condition: "good",
    image: "/images/dell-laptop.jpg",
    distance: 2.0,
    rating: 4.9,
    seller: {
      id: '3',
      name: "Zain Malik",
      rating: 4.8,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "18",
    title: "Mathematics Formula Chart",
    description:
      "Large laminated math formula sheet for quick revision before exams.",
    price: 300,
    category: "Posters",
    condition: "excellent",
    image: "/images/math-chart.jpg",
    distance: 1.2,
    rating: 4.2,
    seller: {
      id: '3',
      name: "Anam Javed",
      rating: 4.4,
      verified: false,
    },
    exchangeType: "donation",
  },
  {
    id: "19",
    title: "Mechanical Keyboard for Coding",
    description:
      "RGB backlit mechanical keyboard for smooth typing experience while programming.",
    price: 7500,
    category: "Electronics",
    condition: "excellent",
    image: "/images/keyboard.jpg",
    distance: 3.7,
    rating: 4.8,
    seller: {
      id: '3',
      id: '2',
      name: "Hamza Tariq",
      rating: 4.9,
      verified: true,
    },
    exchangeType: "sale",
  },
  {
    id: "20",
    title: "Python Programming Notebook",
    description:
      "Well-maintained handwritten notes covering Python basics to advanced topics.",
    price: 700,
    category: "other",
    condition: "fair",
    image: "/images/python-notes.jpg",
    distance: 4.8,
    seller: {
      id: '3',
      id: '1',
      name: "Nimra Aslam",
      rating: 4.3,
      verified: false,
    },
    exchangeType: "exchange",
  },
];

export const mockReviews = [
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
    comment: "Amazing experience! The seller ke
    id: '3',pt me updated and the quality was superb. Would buy again.",
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
    comment: "Perfectly described and delivered. This seller kn
    id: '3',ows how to maintain trust!",
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