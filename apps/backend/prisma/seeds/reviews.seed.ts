import { PrismaClient } from '../../generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedReviews(prisma: PrismaClient) {
  const exchanges = await prisma.exchanges.findMany({
    where: {
      status: "completed",
    },
    include: {
      product: {
        select: {userId: true}
      }
    }
  });

  // console.log(exchanges)
  for (const exchange of exchanges) {
    await prisma.reviews.create({
      data: {
        exchangeId: exchange.exchangeId,
        reviewerid: exchange.buyerId,
        revieweduserid: exchange.product.userId,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    });
  }

  console.log('✅ Reviews seeded');
}
