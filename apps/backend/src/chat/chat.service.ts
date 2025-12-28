import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

const PageSize = 30;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto, senderId: number) {
    // Check if chat already exists between these users for this product
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: createChatDto.receiverId
          },
          {
            senderId: createChatDto.receiverId,
            receiverId: senderId,
          },
        ],
      },
      include: {
        users_chat_senderidTousers: true,
        users_chat_receiveridTousers: true,
        product: {
          select: {
            productId: true,
            userId: true,
            title: true,
            price: true,
            images: true,
            exchangeType: true,
            productCondition: true,
            categoryId: true,
          },
        },
      },
    });

    if (existingChat) {
      await this.update(existingChat.chatId, {productId: createChatDto.productId});
      return this.formatChatResponse(existingChat, senderId);
    }

    // Create new chat
    const chat = await this.prisma.chat.create({
      data: {
        senderId: senderId,
        receiverId: createChatDto.receiverId,
        productId: createChatDto.productId,
      },
      include: {
        users_chat_senderidTousers: true,
        users_chat_receiveridTousers: true,
        product: {
          select: {
            productId: true,
            userId: true,
            title: true,
            price: true,
            images: true,
            exchangeType: true,
            productCondition: true,
            categoryId: true,
          },
        },
      },
    });

    return this.formatChatResponse(chat, senderId);
  }

  findAll() {
    return `This action returns all chat`;
  }

  async findOne(id: number, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        chatId: id,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        users_chat_senderidTousers: {
          select: {
            userId: true,
            userName: true,
            profilePicture: true,
            isVerified: true,
            rating: true,
          },
        },
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
            exchangeType: true,
            productCondition: true,
            categoryId: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            messageId: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    return this.formatChatResponse(chat, userId);
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    console.log('updateing')
    return this.prisma.chat.update({
      where: {
        chatId: id,
      },
      data: {
        ...updateChatDto,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async getConversations(query: any, userId: number) {
    const limit =
      query.limit && query.limit < PageSize ? query.limit : PageSize;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const [rawConversations, currentUser] = await Promise.all([
      this.prisma.chat.findMany({
        skip,
        take: limit,
        orderBy: {
          lastMessageAt: 'desc',
        },
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          ...(query.searchQuery && {
            OR: [
              {
                users_chat_senderidTousers: {
                  userName: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
              {
                users_chat_receiveridTousers: {
                  userName: {
                    contains: query.searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }),
          lastMessage: {
            not: null,
          },
        },
        include: {
          users_chat_senderidTousers: {
            select: {
              userId: true,
              userName: true,
              profilePicture: true,
              isVerified: true,
              rating: true,
              isOnline: true,
            },
          },
          users_chat_receiveridTousers: {
            select: {
              userId: true,
              userName: true,
              profilePicture: true,
              isVerified: true,
              rating: true,
              isOnline: true,
            },
          },
          product: {
            select: {
              productId: true,
              userId: true,
              title: true,
              price: true,
              images: true,
              exchangeType: true,
              productCondition: true,
              categoryId: true,
            },
          },
        },
      }),

      this.usersService.findOne(userId),
    ]);

    const mappedConversations = rawConversations.map((chat) =>
      this.formatChatResponse(chat, userId),
    );

    const formattedCurrentUser = this.formatCurrentUser(currentUser);

    return {
      conversations: mappedConversations,
      currentUser: formattedCurrentUser,
    };
  }

  // Helper function to format chat response
  private formatChatResponse(chat: any, currentUserId: number) {
    const isSender = chat.senderId === currentUserId;
    const participant = isSender
      ? chat.users_chat_receiveridTousers
      : chat.users_chat_senderidTousers;

    const otherUser = isSender
      ? chat.users_chat_senderidTousers
      : chat.users_chat_receiveridTousers;

    // Get last message from chat or from included messages
    let lastMessage = chat.lastMessage;
    let lastMessageAt = chat.lastMessageAt;

    if (chat.messages && chat.messages.length > 0) {
      lastMessage = chat.messages[0]?.content;
      lastMessageAt = chat.messages[0]?.createdAt || chat.lastMessageAt;
    }

    return {
      id: chat.chatId.toString(),
      participant: {
        id: participant?.userId,
        name: participant?.userName,
        profilePicture: participant?.profilePicture,
        verified: participant?.isVerified,
        rating: participant?.rating,
        isOnline: participant?.isOnline,
      },
      lastMessage: lastMessage,
      lastMessageAt: lastMessageAt?.toISOString(),
      unreadCount: 0,
      item: chat.product
        ? {
            id: chat.product.productId.toString(),
            sellerId: chat.product.userId,
            title: chat.product.title,
            price: chat.product.price,
            image: chat.product.images
              ? Array.isArray(chat.product.images)
                ? chat.product.images[0]
                : chat.product.images
              : null,
            exchangeType: chat.product.exchangeType,
            condition: chat.product.productCondition,
            category: chat.product.categoryId?.toString(),
          }
        : null,
    };
  }

  private formatCurrentUser(currentUser: any) {
    return {
      id: currentUser.userId,
      name: currentUser.userName,
      avatar: currentUser.profilePicture,
      verified: currentUser.isVerified,
      isOnline: true,
      rating: currentUser.rating,
    };
  }

  async getMessages(senderId: number, chatId: number, query: any) {
    const limit = 50;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    // Verify the user has access to this chat
    const chat = await this.prisma.chat.findFirst({
      where: {
        chatId,
        OR: [{ senderId: senderId }, { receiverId: senderId }],
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found or access denied');
    }

    const rawMessages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'desc',
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
      id: msg.messageId.toString(),
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      timestamp: msg.createdAt ? msg.createdAt.toISOString() : null,
      type: msg.messageType,
      status: msg.isRead ? 'read' : 'delivered',
      isEdited: false,
      replyTo: null,
    }));
  }
}
