import { PrismaClient } from '../../apps/backend/generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedCategories(prisma: PrismaClient) {
  const categories = [
    'Books',
    'Bags',
    'Uniforms',
    'Calculators',
    'Geometry',
    'Other',
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
