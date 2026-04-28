import { PrismaClient } from '../../generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedCategories(prisma: PrismaClient) {
  const categories = [
    'books',
    'bags',
    'uniform',
    'calculator',
    'geometry',
    'other',
  ];

  for (const name of categories) {
    await prisma.category.create({
      data: {
        categoryName: name,
        description: faker.lorem.sentence(),
        mediaPath: faker.image.url(),
      },
    });
  }

  console.log('✅ Categories seeded');
}
