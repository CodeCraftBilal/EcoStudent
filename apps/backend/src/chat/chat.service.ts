import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async getConversations(id: number) {
    const rawProduct = await this.prisma.chat.findMany({
      where: {
        senderId: id,
      },
      select: {
        chatId: true, lastMessage: true, lastMessageAt: true, users_chat_receiveridTousers: {
          select: {
            userId: true, userName: true, profilePicture: true, isVerified: true, rating: true,
          }
        },
        product: {
          select: {
            productId: true, title: true, price: true, images: true,
          }
        }
      }
    });

    return rawProduct.map((chat) => ({
      id: chat.chatId,
      participant: {
        id: chat.users_chat_receiveridTousers?.userId,
        name: chat.users_chat_receiveridTousers?.userName,
        avatar: chat.users_chat_receiveridTousers?.profilePicture,
        verified: chat.users_chat_receiveridTousers?.isVerified,
        isOnline: true, // Placeholder, implement online status logic as needed
        rating: chat.users_chat_receiveridTousers?.rating,
      },
      lastMessage: chat.lastMessage,
      lastMessageTime: chat.lastMessageAt,
      unreadCount: 0, // Placeholder, implement unread count logic as needed
      item: {
        id: chat.product?.productId,
        title: chat.product?.title,
        price: chat.product?.price,
        image: chat.product?.images ? chat.product?.images[0] : null,
      }
    }))
  }

  create(createChatDto: CreateChatDto, senderId: number) {
    return this.prisma.chat.create({
      data: {
        ...createChatDto,
        senderId,
      },
    });
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
