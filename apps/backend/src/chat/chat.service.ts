import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { FindMessagesDto } from './dto/find-messages.dto';

const PageSize = 30;
@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto, senderId: number) {
    const isChatExist = await this.prisma.chat.findUnique({
      where: {
        senderid_receiverid_unique: {
          senderId: senderId,
          receiverId: createChatDto.receiverId,
        },
      },
    });
    if (isChatExist)
      throw new ConflictException('Chat already exists between these users.');
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

  async getConversations(query: any, senderId: number) {
    const limit =
      query.limit && query.limit < PageSize ? query.limit : PageSize;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const where: any = {
      senderId,
      ...(query.searchQuery && {
        senderId: senderId,
        users_chat_receiveridTousers: {
          userName: {
            contains: query.searchQuery,
            mode: 'insensitive',
          },
        },
      }),
    };

    const [rawConversations, currentUser] = await Promise.all([
      this.prisma.chat.findMany({
        skip,
        take: limit,
        orderBy: {
          lastMessageAt: 'desc',
        },
        where: {
          OR: [
            {senderId},
            {receiverId: senderId}
          ],
          users_chat_receiveridTousers: {
            userName: {
              contains: query.searchQuery,
              mode: 'insensitive',
            },
          },
        },
        select: {
          chatId: true,
          lastMessage: true,
          lastMessageAt: true,
          users_chat_receiveridTousers: {
            select: {
              userId: true,
              userName: true,
              profilePicture: true,
              isVerified: true,
              rating: true,
            },
          },
          product: {
            select: {
              productId: true,
              title: true,
              price: true,
              images: true,
            },
          },
        },
      }),

      this.usersService.findOne(senderId),
    ]);

    const mappedConversations = rawConversations.map((chat) => ({
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
      },
    }));

    return {
      conversations: mappedConversations,
      currentUser: {
        id: currentUser?.userId,
        name: currentUser?.userName,
        avatar: currentUser?.profilePicture,
        verified: currentUser?.isVerified,
        rating: currentUser?.rating,
        isOnline: true, // Placeholder, implement online status logic as needed
      },
    };
  }

  async getMessages(senderId: number, chatId: number, query: any) {
    
    // const PageSize = 50;
    const limit = 50;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const rawMessages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip,
      select: {
        messageId: true,
        senderId: true,
        receiverId: true,
        content: true,
        messageType: true,
        isRead: true,
        createdAt: true,
      },
    });
    return rawMessages.map((msg) => ({
      id: msg.messageId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      timestamp: msg.createdAt,
      type: msg.messageType,
      status: msg.isRead,
      isEdited: false,
      replyTo: null,
    }));
  }
}
