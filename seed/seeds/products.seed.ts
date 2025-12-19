import {
  PrismaClient,
  product_condition,
  product_type,
  exchange_type,
  PRODUCT_STATUS,
} from '../../apps/backend/generated/prisma';
import { faker } from '@faker-js/faker';
import { randomImages } from '../utils/image.util';

export async function seedProducts(prisma: PrismaClient, count = 30) {
  const users = await prisma.users.findMany();
  const categories = await prisma.category.findMany();

  for (let i = 0; i < count; i++) {
    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.number.float({ min: 100, max: 5000 }),
        images: randomImages(3),
        productCondition: faker.helpers.arrayElement(
          Object.values(product_condition),
        ),
        productType: faker.helpers.arrayElement(
          Object.values(product_type),
        ),
        exchangeType: faker.helpers.arrayElement(
          Object.values(exchange_type),
        ),
        status: faker.helpers.arrayElement(
          Object.values(PRODUCT_STATUS),
        ),
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
