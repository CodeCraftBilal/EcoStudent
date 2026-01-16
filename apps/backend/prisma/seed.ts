import { PrismaClient } from '../generated/prisma';

import { seedUsers, updateLocation } from './seeds/users.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedCustomProducts, seedProducts } from './seeds/products.seed';
import { seedChats } from './seeds/chats.seed';
import { seedMessages, seedOneChat } from './seeds/messages.seed';
import { seedExchanges } from './seeds/exchanges.seed';
import { seedReviews } from './seeds/reviews.seed';

const prisma = new PrismaClient();

async function main() {
  await seedCategories(prisma);
  await seedUsers(prisma, 20);
  await updateLocation(prisma, 33.54, 73.14);
  // await seedProducts(prisma);
  await seedCustomProducts(prisma);
  // await seedChats(prisma);
  // await seedMessages(prisma);
  // await seedExchanges(prisma);
  // await seedReviews(prisma);
  // await seedOneChat(prisma, 111)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
