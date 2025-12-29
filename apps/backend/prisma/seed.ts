import { PrismaClient } from '../generated/prisma';

import { seedUsers } from '../../../seed/seeds/users.seed';
import { seedCategories } from '../../../seed/seeds/categories.seed';
import { seedProducts } from '../../../seed/seeds/products.seed';
import { seedChats } from '../../../seed/seeds/chats.seed';
import { seedMessages } from '../../../seed/seeds/messages.seed';
import { seedExchanges } from '../../../seed/seeds/exchanges.seed';
import { seedReviews } from '../../../seed/seeds/reviews.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
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
