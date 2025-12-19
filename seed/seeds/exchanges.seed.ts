import { PrismaClient, exchange_type, exchange_status } from '../../apps/backend/generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedExchanges(prisma: PrismaClient) {
  const users = await prisma.users.findMany();
  const products = await prisma.product.findMany();

  for (let i = 0; i < 10; i++) {
    await prisma.exchanges.create({
      data: {
        buyerId: faker.helpers.arrayElement(users).userId,
        productId: faker.helpers.arrayElement(products).productId,
        exchangeType: faker.helpers.arrayElement(Object.values(exchange_type)),
        status: faker.helpers.arrayElement(Object.values(exchange_status)),
        agreedPrice: faker.number.float({ min: 500, max: 3000 }),
        meetupLocation: faker.location.streetAddress(),
        meetupLatitude: faker.location.latitude(),
        meetupLongitude: faker.location.longitude(),
        meetupTime: faker.date.future(),
      },
    });
  }

  console.log('✅ Exchanges seeded');
}
