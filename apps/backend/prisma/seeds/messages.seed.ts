import { PrismaClient, message_type } from '../../apps/backend/generated/prisma';
import { faker } from '@faker-js/faker';

export async function seedMessages(prisma: PrismaClient) {
  const chats = await prisma.chat.findMany();

  for (const chat of chats) {
    await prisma.message.create({
      data: {
        chatId: chat.chatId,
        senderId: chat.senderId,
        receiverId: chat.receiverId,
        messageType: message_type.TEXT,
        content: faker.lorem.sentence(),
        isRead: faker.datatype.boolean(),
        createdAt: faker.date.recent(),
      },
    });
  }

  console.log('✅ Messages seeded');
}
