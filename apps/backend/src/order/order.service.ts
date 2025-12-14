import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createOrderDto: CreateOrderDto, buyerId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        productId: createOrderDto.productId,
      },
    });

    if (!product || product?.status != 'active')
      throw new NotFoundException('product not found');

    await this.productService.update(product.productId, { status: 'reserved' });
    return this.prisma.exchanges.create({
      data: {
        ...createOrderDto,
        exchangeType: product.exchangeType,
        buyerId,
      },
    });
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

  update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      return this.prisma.exchanges.update({
        where: {
          exchangeId: id,
        },
        data: updateOrderDto,
      });
    } catch (err) {
      return err;
    }
  }

  createReview(body: CreateReviewDto) {
    this.reviewService.create(body);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.prisma.exchanges.findUnique({
      where: { exchangeId: orderId },
    });

    if (
      !order ||
      order.status === 'cancelled' ||
      order.status === 'completed' ||
      order.buyerId != userId
    )
      throw new NotFoundException('Order Not Found');

    const product = await this.productService.update(order?.productId, {
      status: 'active',
    });
    return await this.update(orderId, { status: 'cancelled' });
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
}
