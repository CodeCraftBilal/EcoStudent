import { PrismaClient, message_type } from '../../generated/prisma';
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

export async function seedOneChat(prisma: PrismaClient, chatId: number) {
  const chat = await prisma.chat.findUnique({
    where: { chatId },
  });

  if (!chat) {
    console.log('no chat found with id ', chatId);
    return;
  }

  for (let i = 0; i <= 50; i++) {
    await prisma.message.create({
      data: {
        chatId: chat.chatId,
        senderId: i % 2 == 0 ? chat.senderId : chat.receiverId,
        receiverId: i % 2 == 0 ? chat.receiverId : chat.senderId,
        messageType: message_type.TEXT,
        content: faker.lorem.sentence(),
        isRead: true,
        createdAt: faker.date.recent(),
      },
    });
  }

  console.log('messages seeded for chat id ', chatId);
}
