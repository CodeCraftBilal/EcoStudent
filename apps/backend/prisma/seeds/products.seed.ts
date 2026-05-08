import {
  PrismaClient,
  product_condition,
  product_type,
  exchange_type,
  PRODUCT_STATUS,
} from '../../generated/prisma';
import { faker } from '@faker-js/faker';

const mockItems = [
  {
    id: '1',
    title: 'Calculus Early Transcendentals',
    description:
      'Like new condition, barely used. Perfect for engineering students.',
    price: 2500,
    originalPrice: 4000,
    category: 'books',
    condition: 'excellent',
    image: '/calculusbook.jpg',
    distance: 1.2,
    rating: 4.8,
    seller: {
      id: '3',
      name: 'Ali Ahmed',
      rating: 4.9,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '2',
    title: 'Oxford University Uniform',
    description: 'Complete set with blazer, trousers, and tie. Size medium.',
    price: 1500,
    category: 'uniform',
    condition: 'good',
    image: '/imgshop/oxforduniform.png',
    distance: 2.5,
    rating: 4.5,
    seller: {
      id: '3',
      name: 'Sara Khan',
      rating: 4.7,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '3',
    title: 'Scientific Calculator FX-991ES',
    description:
      'Casio scientific calculator with all functions working perfectly.',
    price: 800,
    category: 'calculator',
    condition: 'excellent',
    image: '/imgshop/calc.png',
    distance: 0.8,
    rating: 4.9,
    seller: {
      id: '3',
      name: 'Bilal Raza',
      rating: 5.0,
      verified: false,
    },
    exchangeType: 'exchange',
  },
  {
    id: '4',
    title: 'Geometry Box Set',
    description: 'Full geometry set with compass, protector, and ruler.',
    price: 300,
    category: 'geometry',
    condition: 'good',
    image: '/imgshop/geomat.png',
    distance: 3.1,
    rating: 4.3,
    seller: {
      id: '3',
      name: 'Fatima Noor',
      rating: 4.4,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '5',
    title: 'School Bag Backpack',
    description: 'Waterproof school backpack with laptop compartment.',
    price: 1200,
    category: 'bags',
    condition: 'fair',
    image: '/imgshop/bag.png',
    distance: 1.8,
    seller: {
      id: '3',
      name: 'Usman Ali',
      rating: 4.6,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '6',
    title: 'Physics Textbook Advanced',
    description: 'Physics concepts and problems for college students.',
    price: 0,
    category: 'books',
    condition: 'good',
    image: '/imgshop/phybook.png',
    distance: 4.2,
    seller: {
      id: '3',
      name: 'Ayesha Malik',
      rating: 4.8,
      verified: true,
    },
    exchangeType: 'donation',
  },
  {
    id: '11',
    title: 'Casio FX-991EX Scientific Calculator',
    description:
      'Advanced scientific calculator suitable for engineering and science students.',
    price: 4500,
    originalPrice: 6000,
    category: 'calculator',
    condition: 'excellent',
    image: '/imgshop/calc.png',
    distance: 2.5,
    rating: 4.8,
    seller: {
      id: '3',
      name: 'Ali Raza',
      rating: 4.9,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '12',
    title: 'Data Structures and Algorithms Book',
    description:
      'Comprehensive guide for computer science students with C++ examples.',
    price: 1200,
    category: 'books',
    condition: 'good',
    image: '/imgshop/dsa-book.png',
    distance: 4.2,
    rating: 4.6,
    seller: {
      id: '3',
      name: 'Hassan Ahmad',
      rating: 4.7,
      verified: false,
    },
    exchangeType: 'exchange',
  },
  {
    id: '13',
    title: 'Engineering Drawing Set',
    description:
      'Complete drawing set including compass, divider, protractor, and scale for engineering students.',
    price: 800,
    originalPrice: 1000,
    category: 'other',
    condition: 'excellent',
    image: '/imgshop/drawing-set.png',
    distance: 1.8,
    rating: 4.5,
    seller: {
      id: '3',
      name: 'Fatima Noor',
      rating: 4.8,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '14',
    title: 'Arduino Starter Kit',
    description:
      'Perfect for beginners learning electronics and programming with Arduino.',
    price: 5500,
    originalPrice: 6500,
    category: 'calculator',
    condition: 'good',
    image: '/imgshop/arduino-kit.jpg',
    distance: 3.1,
    rating: 4.9,
    seller: {
      id: '3',
      name: 'Muhammad Bilal',
      rating: 4.9,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '15',
    title: 'Laptop Backpack',
    description:
      'Durable water-resistant backpack with laptop compartment and multiple pockets for students.',
    price: 2000,
    category: 'other',
    condition: 'excellent',
    image: '/imgshop/backpack.png',
    distance: 5.4,
    rating: 4.4,
    seller: {
      id: '3',
      name: 'Sara Khan',
      rating: 4.6,
      verified: false,
    },
    exchangeType: 'sale',
  },
  {
    id: '16',
    title: 'Whiteboard with Markers',
    description:
      'Portable whiteboard perfect for study rooms or home learning setup.',
    price: 1500,
    category: 'other',
    condition: 'good',
    image: '/imgshop/whiteboard.png',
    distance: 6.0,
    rating: 4.3,
    seller: {
      id: '3',
      name: 'Aqeel Rehman',
      rating: 4.7,
      verified: true,
    },
    exchangeType: 'donation',
  },
  {
    id: '17',
    title: 'Programming Laptop (Dell Latitude 7490)',
    description:
      'Used laptop with Core i5, 8GB RAM, SSD — ideal for students and developers.',
    price: 65000,
    originalPrice: 80000,
    category: 'other',
    condition: 'good',
    image: '/imgshop/dell-laptop.jpg',
    distance: 2.0,
    rating: 4.9,
    seller: {
      id: '3',
      name: 'Zain Malik',
      rating: 4.8,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '18',
    title: 'Mathematics Formula Chart',
    description:
      'Large laminated math formula sheet for quick revision before exams.',
    price: 300,
    category: 'other',
    condition: 'excellent',
    image: '/imgshop/math-chart.png',
    distance: 1.2,
    rating: 4.2,
    seller: {
      id: '3',
      name: 'Anam Javed',
      rating: 4.4,
      verified: false,
    },
    exchangeType: 'donation',
  },
  {
    id: '19',
    title: 'Mechanical Keyboard for Coding',
    description:
      'RGB backlit mechanical keyboard for smooth typing experience while programming.',
    price: 7500,
    category: 'calculator',
    condition: 'excellent',
    image: '/imgshop/keyboard.jpg',
    distance: 3.7,
    rating: 4.8,
    seller: {
      id: '3',
      name: 'Hamza Tariq',
      rating: 4.9,
      verified: true,
    },
    exchangeType: 'sale',
  },
  {
    id: '20',
    title: 'Python Programming Notebook',
    description:
      'Well-maintained handwritten notes covering Python basics to advanced topics.',
    price: 700,
    category: 'other',
    condition: 'fair',
    image: '/imgshop/python-notes.png',
    distance: 4.8,
    seller: {
      id: '3',
      name: 'Nimra Aslam',
      rating: 4.3,
      verified: false,
    },
    exchangeType: 'exchange',
  },
];

export async function seedProducts(prisma: PrismaClient, count = 30) {
  const users = await prisma.users.findMany();
  const categories = await prisma.category.findMany();

  for (let i = 0; i < count; i++) {
    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.number.float({ min: 100, max: 5000 }),
        images: faker.image.urlPicsumPhotos(),
        productCondition: faker.helpers.arrayElement(
          Object.values(product_condition),
        ),
        viewCount: faker.number.int({min: 10, max: 50}),
        productType: faker.helpers.arrayElement(Object.values(product_type)),
        exchangeType: faker.helpers.arrayElement(Object.values(exchange_type)),
        status: faker.helpers.arrayElement(Object.values(PRODUCT_STATUS)),
        users: {
          connect: { userId: faker.helpers.arrayElement(users).userId },
        },
        category: {
          connect: {
            categoryId: faker.helpers.arrayElement(categories).categoryId,
          },
        },
      },
    });
  }

  console.log('✅ Products seeded');
}

export async function seedCustomProducts(prisma: PrismaClient, count = 30) {
  const users = await prisma.users.findMany();
  const categories = await prisma.category.findMany();

  mockItems.forEach(async (item) => {
    await prisma.product.create({
      data: {
        title: item.title,
        description: item.description,
        price: item.price,
        images: Array.isArray(item.image) ? item.image : [item.image],
        productCondition: item.condition as product_condition,
        productType: item.category as product_type,
        exchangeType: item.exchangeType as exchange_type,
        status: 'active',
        users: {
          connect: { userId: faker.helpers.arrayElement(users).userId },
        },
        category: {
          connect: {
            categoryId: getCategoryId(item.category),
          },
        },
      },
    });
  });

  console.log('✅ Custom Products seeded');
}

const getCategoryId = (category: string) => {
  const categories = [
    {
      id: 1,
      name: 'books'
    },
    {
      id: 2,
      name: 'bags',
    },
    {
      id: 3,
      name: 'uniform'
    },
    {
      id: 4,
      name: 'calculator'
    },
    {
      id: 5,
      name: 'geometry'
    },
    {
      id: 6,
      name: 'other'
    },
  ];

  return categories.find(c => c.name === category)?.id ?? 6;
};
