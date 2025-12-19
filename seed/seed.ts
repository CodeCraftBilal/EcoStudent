import { PrismaClient } from '../apps/backend/generated/prisma';

import { seedUsers } from './seeds/users.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedProducts } from './seeds/products.seed';
import { seedChats } from './seeds/chats.seed';
import { seedMessages } from './seeds/messages.seed';
import { seedExchanges } from './seeds/exchanges.seed';
import { seedReviews } from './seeds/reviews.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  // await seedCategories(prisma);
  await seedProducts(prisma);
  await seedChats(prisma);
  await seedMessages(prisma);
  await seedExchanges(prisma);
  await seedReviews(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
