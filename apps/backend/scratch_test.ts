import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Try to increment a product
  const product = await prisma.product.findFirst();
  if (product) {
    console.log('Original viewCount:', product.viewCount);
    const updated = await prisma.product.update({
      where: { productId: product.productId },
      data: { viewCount: { increment: 1 } }
    });
    console.log('Updated viewCount:', updated.viewCount);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
