import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { UpdateReviewDto } from 'src/review/dto/update-review.dto';
import { ReviewService } from 'src/review/review.service';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';

const PAGE_LIMIT = 12;

@Injectable()
export class OrderService {
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService
  ) {}

  async create(createOrderDto: CreateOrderDto, sellerId: number) {
    try {
      // Find the product
      const product = await this.prisma.product.findUnique({
        where: {
          productId: createOrderDto.productId,
        },
        include: {
          users: true, // Include seller info
        },
      });

      if (!product || product.status !== 'active') {
        throw new NotFoundException('Product not found or not available');
      }

      // Check if buyer is not the seller
      // if (product.userId === buyerId) {
      //   throw new ForbiddenException('You cannot create an order for your own product');
      // }

      // Update product status to reserved
      await this.prisma.product.update({
        where: { productId: product.productId },
        data: { status: 'reserved' },
      });

      // Create the order
      const order = await this.prisma.exchanges.create({
        data: {
          productId: createOrderDto.productId,
          buyerId: 65,
          exchangeType: product.exchangeType,
          agreedPrice: createOrderDto.agreedPrice,
          meetupLocation: createOrderDto.meetupLocation,
          meetupLatitude: createOrderDto.meetupLatitude,
          meetupLongitude: createOrderDto.meetupLongitude,
          meetupTime: new Date(createOrderDto.meetupTime),
          status: 'pending',
        },
        include: {
          product: {
            include: {
              users: true,
            },
          },
          users: {
            select: {
              userId: true,
              userName: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });
      console.log("Order created:", order);

      // Format the response
      return {
        id: order.exchangeId,
        productId: order.productId,
        buyerId: order.buyerId,
        sellerId: product.userId,
        status: order.status,
        agreedPrice: Number(order.agreedPrice),
        meetupLocation: order.meetupLocation,
        meetupLatitude: Number(order.meetupLatitude),
        meetupLongitude: Number(order.meetupLongitude),
        meetupTime: order.meetupTime.toISOString(),
        createdAt: order.createdAt ? order.createdAt.toISOString() : null,
        product: {
          id: order.product.productId,
          title: order.product.title,
          price: order.product.price ? Number(order.product.price) : 0,
          images: order.product.images as string[],
          userId: order.product.userId,
        },
        buyer: {
          id: order.users.userId,
          name: order.users.userName,
          email: order.users.email,
          profilePicture: order.users.profilePicture,
        },
        seller: {
          id: order.product.users ? order.product.users.userId : null,
          name: order.product.users ? order.product.users.userName : null,
          email: order.product.users ? order.product.users.email : null,
          profilePicture: order.product.users ? order.product.users.profilePicture : null,
        },
      };
    } catch (error) {
      console.log("Error creating order:", error);
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto, userId: number) {
    try {
      // Find the existing order
      const existingOrder = await this.prisma.exchanges.findUnique({
        where: { exchangeId: orderId },
        include: {
          product: {
            include: {
              users: true,
            },
          },
        },
      });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      // Check if user is the seller (product owner)
      const isSeller = existingOrder.product.userId === userId;
      if (!isSeller) {
        throw new ForbiddenException('Only the seller can update order details');
      }

      // Only allow updating certain fields
      const updatableFields = {
        agreedPrice: updateOrderDto.agreedPrice,
        meetupLocation: updateOrderDto.meetupLocation,
        meetupLatitude: updateOrderDto.meetupLatitude,
        meetupLongitude: updateOrderDto.meetupLongitude,
        ...(updateOrderDto.meetupTime && { meetupTime: new Date(updateOrderDto.meetupTime) }),
      };

      // Remove undefined values
      Object.keys(updatableFields).forEach(key => {
        if (updatableFields[key] === undefined) {
          delete updatableFields[key];
        }
      });

      // Update the order
      const updatedOrder = await this.prisma.exchanges.update({
        where: { exchangeId: orderId },
        data: updatableFields,
        include: {
          product: {
            include: {
              users: true,
            },
          },
          users: {
            select: {
              userId: true,
              userName: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });

      // Format the response
      return {
        id: updatedOrder.exchangeId,
        productId: updatedOrder.productId,
        buyerId: updatedOrder.buyerId,
        sellerId: updatedOrder.product.userId,
        status: updatedOrder.status,
        agreedPrice: Number(updatedOrder.agreedPrice),
        meetupLocation: updatedOrder.meetupLocation,
        meetupLatitude: Number(updatedOrder.meetupLatitude),
        meetupLongitude: Number(updatedOrder.meetupLongitude),
        meetupTime: updatedOrder.meetupTime.toISOString(),
        createdAt: updatedOrder.createdAt ? updatedOrder.createdAt.toISOString() : null,
        product: {
          id: updatedOrder.product.productId,
          title: updatedOrder.product.title,
          price: updatedOrder.product.price ? Number(updatedOrder.product.price) : 0,
          images: updatedOrder.product.images as string[],
          userId: updatedOrder.product.userId,
        },
        buyer: {
          id: updatedOrder.users.userId,
          name: updatedOrder.users.userName,
          email: updatedOrder.users.email,
          profilePicture: updatedOrder.users.profilePicture,
        },
        seller: {
          id: updatedOrder.product.users ? updatedOrder.product.users.userId : null,
          name: updatedOrder.product.users ? updatedOrder.product.users.userName : null,
          email: updatedOrder.product.users ? updatedOrder.product.users.email : null,
          profilePicture: updatedOrder.product.users ? updatedOrder.product.users.profilePicture : null,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }
  }

  async updateStatus(orderId: number, status: string, userId: number) {
    try {
      const existingOrder = await this.prisma.exchanges.findUnique({
        where: { exchangeId: orderId },
        include: {
          product: true,
        },
      });

      if (!existingOrder) {
        throw new NotFoundException('Order not found');
      }

      // Check if user is either buyer or seller
      const isBuyer = existingOrder.buyerId === userId;
      const isSeller = existingOrder.product.userId === userId;

      if (!isBuyer && !isSeller) {
        throw new ForbiddenException('You are not authorized to update this order');
      }

      // Validate status transitions based on user role
      const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      // Update the order status
      const updatedOrder = await this.prisma.exchanges.update({
        where: { exchangeId: orderId },
        data: { 
          status: status as any,
          ...(status === 'completed' && { completedAt: new Date() }),
        },
      });

      // If order is completed or cancelled, release the product
      if (status === 'completed' || status === 'cancelled') {
        await this.prisma.product.update({
          where: { productId: existingOrder.productId },
          data: { status: status === 'completed' ? 'sold' : 'active' },
        });
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  findAll(page: number = 1) {
    const skip = (page - 1) * PAGE_LIMIT;
    return this.prisma.exchanges.findMany({
      skip,
      take: PAGE_LIMIT,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  createReview(body: CreateReviewDto) {
    this.reviewService.create(body);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getAllByBuyerId(userId: number, query: any) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 12;
    const skip = (page - 1) * limit;

    const where: any = {
      buyerId: userId,

      // STATUS FILTER
      ...(query.status &&
        query.status !== 'all' && {
          status: query.status,
        }),

      // SEARCH (product fields)
      ...(query.search && {
        product: {
          OR: [
            {
              title: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),

      // CATEGORY FILTER
      ...(query.category &&
        query.category !== 'all' && {
          product: {
            category: {
              categoryName: query.category,
            },
          },
        }),
    };

    // SORTING
    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    if (query.sortBy === 'price_low') orderBy = { agreedPrice: 'asc' };
    if (query.sortBy === 'price_high') orderBy = { agreedPrice: 'desc' };

    console.log('where ', where);
    const [data, totalOrders, TotalSpent, CompletedOrders, PendingReviews] =
      await Promise.all([
        this.prisma.exchanges.findMany({
          take: limit,
          skip,
          where,
          orderBy,
          select: {
            exchangeId: true,
            status: true,
            createdAt: true,
            meetupTime: true,
            agreedPrice: true,
            meetupLocation: true,
            meetupLatitude: true,
            meetupLongitude: true,
            product: {
              select: {
                productId: true,
                title: true,
                description: true,
                price: true,
                images: true,
                category: {
                  select: { categoryName: true },
                },
                productCondition: true,
                users: {
                  select: {
                    userId: true,
                    userName: true,
                    profilePicture: true,
                    rating: true,
                    isVerified: true,
                    reviews_reviews_revieweduseridTousers: {
                      where: { reviewerid: userId },
                      select: {
                        rating: true,
                        comment: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),

        // TOTAL ORDERS
        this.prisma.exchanges.count({
          where: {
            buyerId: userId,
          },
        }),

        // TOTAL SPENT
        this.prisma.exchanges.aggregate({
          where: { buyerId: userId, status: 'completed' },
          _sum: { agreedPrice: true },
        }),

        // COMPLETED ORDERS
        this.prisma.exchanges.count({
          where: { buyerId: userId, status: 'completed' },
        }),

        // PENDING REVIEWS
        this.prisma.exchanges.count({
          where: {
            buyerId: userId,
            status: 'completed',
            reviews: { none: {} },
          },
        }),
      ]);

    const mappedData = data.map((d) => ({
      id: d.exchangeId,
      item: {
        id: d.product.productId,
        title: d.product.title,
        description: d.product.description,
        price: d.agreedPrice,
        image: d.product.images?.[0] ?? '',
        category: d.product.category?.categoryName,
        condition: d.product.productCondition,
      },
      seller: {
        id: d.product.users?.userId,
        name: d.product.users?.userName,
        avatar: d.product.users?.profilePicture,
        rating: d.product.users?.rating,
        verified: d.product.users?.isVerified,
      },
      status: d.status,
      purchaseDate: d.createdAt,
      deliveredDate: d.meetupTime,
      quantity: 1,
      totalAmount: Number(d.agreedPrice),
      paymentMethod: 'cash',
      meetupLocation: d.meetupLocation,
      latitude: d.meetupLatitude,
      longitude: d.meetupLongitude,
      rating:
        d.product.users?.reviews_reviews_revieweduseridTousers.length === 0
          ? null
          : d.product.users?.reviews_reviews_revieweduseridTousers,
      review:
        d.product.users?.reviews_reviews_revieweduseridTousers.length === 0
          ? null
          : d.product.users?.reviews_reviews_revieweduseridTousers,
    }));

    return {
      data: mappedData,
      purchaseStats: {
        totalPurchases: totalOrders,
        totalSpent: TotalSpent._sum.agreedPrice ?? 0,
        completedOrders: CompletedOrders,
        pendingReviews: PendingReviews,
      },
    };
  }

  async findByConversation(conversationId: number, userId: number) {
    try {
      // First, find the conversation/chat
      const chat = await this.prisma.chat.findUnique({
        where: { chatId: conversationId },
        include: {
          product: {
            include: {
              users: true, // Include seller info
            },
          },
          users_chat_senderidTousers: true, // Include sender info
          users_chat_receiveridTousers: true, // Include receiver info
        },
      });

      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      // Check if user is a participant in this conversation
      if (chat.senderId !== userId && chat.receiverId !== userId) {
        throw new ForbiddenException('You are not a participant in this conversation');
      }

      // Determine who is the buyer and who is the seller
      const isSeller = chat.product?.userId === userId;
      const buyerId = isSeller 
        ? (chat.senderId === userId ? chat.receiverId : chat.senderId) 
        : userId;
      const sellerId = chat.product?.userId;

      // Find the order for this conversation
      const order = await this.prisma.exchanges.findFirst({
        where: {
          productId: chat.productId,
          buyerId: buyerId,
        },
        include: {
          product: {
            include: {
              users: true, // Include seller
            },
          },
          users: {
            select: {
              userId: true,
              userName: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('No order found for this conversation');
      }

      // Format the response to match the Order interface
      const formattedOrder = {
        id: order.exchangeId,
        productId: order.productId,
        buyerId: order.buyerId,
        sellerId: sellerId,
        status: order.status,
        agreedPrice: Number(order.agreedPrice),
        meetupLocation: order.meetupLocation,
        meetupLatitude: Number(order.meetupLatitude),
        meetupLongitude: Number(order.meetupLongitude),
        meetupTime: order.meetupTime.toISOString(),
        createdAt: order.createdAt ? order.createdAt.toISOString() : null,
        product: {
          id: order.product.productId,
          title: order.product.title,
          price: order.product.price ? Number(order.product.price) : 0,
          images: order.product.images as string[],
          userId: order.product.userId,
        },
        buyer: {
          id: order.users.userId,
          name: order.users.userName,
          email: order.users.email,
          profilePicture: order.users.profilePicture,
        },
        seller: {
          id: order.product.users ? order.product.users.userId : null,
          name: order.product.users ? order.product.users.userName : null,
          email: order.product.users ? order.product.users.email : null,
          profilePicture: order.product.users ? order.product.users : null,
        },
      };

      return formattedOrder;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error finding order by conversation:', error);
      throw new Error('Failed to find order');
    }
  }

  // orders.service.ts - Add these methods
async acceptOrder(orderId: number, buyerId: number) {
  try {
    const order = await this.prisma.exchanges.findUnique({
      where: { exchangeId: orderId },
      include: { product: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify buyer
    if (order.buyerId !== buyerId) {
      throw new ForbiddenException('Only the buyer can accept this order');
    }

    // Check if order is in pending state
    if (order.status !== 'pending') {
      throw new BadRequestException('Order can only be accepted when in pending state');
    }

    // Update order status to accepted
    const updatedOrder = await this.prisma.exchanges.update({
      where: { exchangeId: orderId },
      data: { status: 'accepted' }
    });

    // Send notification to seller
    await this.sendNotification(
      order.product.userId,
      'Order Accepted',
      `Your order #${orderId} has been accepted by the buyer`,
      'order',
      orderId
    );

    return updatedOrder;
  } catch (error) {
    if (error instanceof NotFoundException || 
        error instanceof ForbiddenException || 
        error instanceof BadRequestException) {
      throw error;
    }
    console.error('Error accepting order:', error);
    throw new Error('Failed to accept order');
  }
}

async cancelOrder(orderId: number, userId: number, reason?: string) {
  try {
    const order = await this.prisma.exchanges.findUnique({
      where: { exchangeId: orderId },
      include: { product: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify user is either buyer or seller
    const isBuyer = order.buyerId === userId;
    const isSeller = order.product.userId === userId;

    if (!isBuyer && !isSeller) {
      throw new ForbiddenException('You are not authorized to cancel this order');
    }

    // If buyer is trying to cancel, check if within 10% time window
    if (isBuyer) {
      const createdAt = new Date(order.createdAt).getTime();
      const meetupTime = new Date(order.meetupTime).getTime();
      const now = Date.now();
      
      const totalTime = meetupTime - createdAt;
      const cancellationDeadline = createdAt + (totalTime * 0.1);
      
      if (now > cancellationDeadline) {
        throw new ForbiddenException('Cancellation window has expired');
      }
    }

    // Update order status to cancelled
    const updatedOrder = await this.prisma.exchanges.update({
      where: { exchangeId: orderId },
      data: { 
        status: 'cancelled',
        ...(reason && { cancellationReason: reason })
      }
    });

    // Update product status back to active
    await this.prisma.product.update({
      where: { productId: order.productId },
      data: { status: 'active' }
    });

    // Send notification to other party
    const otherUserId = isBuyer ? order.product.userId : order.buyerId;
    await this.sendNotification(
      otherUserId,
      'Order Cancelled',
      `Order #${orderId} has been cancelled${reason ? `: ${reason}` : ''}`,
      'order',
      orderId
    );

    return updatedOrder;
  } catch (error) {
    if (error instanceof NotFoundException || 
        error instanceof ForbiddenException) {
      throw error;
    }
    console.error('Error cancelling order:', error);
    throw new Error('Failed to cancel order');
  }
}

private async sendNotification(
  userId: number,
  title: string,
  message: string,
  type: string,
  entityId: number
) {
  await this.prisma.notifications.create({
    data: {
      userid: userId,
      title,
      message,
      type,
      relatedentitytype: 'order',
      relatedentityid: entityId,
      isread: false
    }
  });
}
  
}
