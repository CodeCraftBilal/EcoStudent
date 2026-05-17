import { PrismaClient } from '../generated/prisma';

import { seedUsers, updateLocation } from './seeds/users.seed';
import { seedCategories } from './seeds/categories.seed';
import { generateAndStoreEmbeddings, seedCustomProducts, seedProducts } from './seeds/products.seed';
import { seedChats } from './seeds/chats.seed';
import { seedMessages, seedOneChat } from './seeds/messages.seed';
import { seedExchanges } from './seeds/exchanges.seed';
import { seedReviews } from './seeds/reviews.seed';
import {PrismaPg} from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({adapter});

async function main() {
  // await seedCategories(prisma);
  // await seedUsers(prisma, 20);
  // await updateLocation(prisma, 33.7233, 73.0435);
  // await seedProducts(prisma);
  // await seedCustomProducts(prisma);
  // await seedChats(prisma);
  // await seedMessages(prisma);
  // await seedExchanges(prisma);
  // await seedReviews(prisma);
  // await seedOneChat(prisma, 111)
  await generateAndStoreEmbeddings(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
