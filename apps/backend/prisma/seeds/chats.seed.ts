import { PrismaClient } from '../../generated/prisma';

export async function seedChats(prisma: PrismaClient) {
  const users = await prisma.users.findMany();
  const products = await prisma.product.findMany();

  const createdPairs = new Set<string>();

  let attempts = 0;

  while (createdPairs.size < 20 && attempts < 100) {
    attempts++;

    const sender = users[Math.floor(Math.random() * users.length)];
    const receiver = users[Math.floor(Math.random() * users.length)];

    if (sender.userId === receiver.userId) continue;

    const key = `${sender.userId}-${receiver.userId}`;
    if (createdPairs.has(key)) continue;

    createdPairs.add(key);

    await prisma.chat.create({
      data: {
        senderId: sender.userId,
        receiverId: receiver.userId,
        productId: products[Math.floor(Math.random() * products.length)].productId,
        lastMessage: 'Hello, is this still available?',
        lastMessageAt: new Date(),
      },
    });
  }

  console.log('✅ Chats seeded');
}
