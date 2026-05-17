import {
  PrismaClient,
  product_condition,
  product_type,
  exchange_type,
  PRODUCT_STATUS,
} from '../../generated/prisma';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';
import { mockItems } from './data/products';

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
        viewCount: faker.number.int({ min: 10, max: 50 }),
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
      name: 'books',
    },
    {
      id: 2,
      name: 'bags',
    },
    {
      id: 3,
      name: 'uniform',
    },
    {
      id: 4,
      name: 'calculator',
    },
    {
      id: 5,
      name: 'geometry',
    },
    {
      id: 6,
      name: 'other',
    },
  ];

  return categories.find((c) => c.name === category)?.id ?? 6;
};

export async function generateAndStoreEmbeddings(prisma: PrismaClient) {
  console.log('generating and storing ebedings');
  try {
    const products = await prisma.$queryRaw<
      { productId: number; images: any }[]
    >`
      SELECT productid as "productId", images
      FROM product
      WHERE embedding IS NULL
    `;

    console.log(products);

    for (const product of products) {
      try {
        const imagePath = product.images?.[0];

        if (!imagePath) continue;

        const absolutePath = path.join(
          process.cwd(),
          '..',
          'frontend',
          'public',
          imagePath,
        );

        if (!fs.existsSync(absolutePath)) continue;

        const imageBuffer = fs.readFileSync(absolutePath);
        let mimeType = 'image/jpeg';

        if (absolutePath.toLowerCase().endsWith('.png')) {
          mimeType = 'image/png';
        } else if (
          absolutePath.toLowerCase().endsWith('.jpg') ||
          absolutePath.toLowerCase().endsWith('.jpeg')
        ) {
          mimeType = 'image/jpeg';
        } else if (absolutePath.toLowerCase().endsWith('.webp')) {
          mimeType = 'image/webp';
        }
        const blob = new Blob([imageBuffer], { type: mimeType });

        const formData = new FormData();
        formData.append('productId', product.productId.toString());
        formData.append('file', blob, path.basename(absolutePath));

        const response = await fetch(
          `http://127.0.0.1:5000/embeddings/product`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          console.error(
            `Failed to generate embedding for product ${product.productId}: ${await response.text()}`,
          );
        } else {
          console.log(
            `Successfully generated embedding for product ${product.productId}`,
          );
        }
      } catch (err) {
        continue;
      }
    }

    return {
      success: true,
      message: 'Embeddings generated and stored successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to generate embeddings',
    };
  }
}
