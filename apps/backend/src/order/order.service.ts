import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

const PAGE_LIMIT = 12;

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
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

  async getAllByBuyerId(userId: number) {

    let where = {
      buyerId: userId
    }

    const [data, totalOrders, TotalSpent, CompltedOrders, PendingReviews] = await Promise.all([
      this.prisma.exchanges.findMany({
        where,
        select: {
          product: {
            select: {
              productId: true, title: true, description: true, price: true, images: true, category: true, productCondition: true,
              users: {
                select: {
                  userId: true, userName: true, profilePicture: true, rating: true, isVerified: true,
                  reviews_reviews_revieweduseridTousers: {
                    where: {
                      reviewerid: where.buyerId,
                    },
                    select: {
                      rating: true,
                      comment: true,
                    }
                  }
                }
              }
            }
          }
        }
      }),

      // total Orders
      this.prisma.exchanges.count({
        where
      }),

      // TotalSpent
      this.prisma.exchanges.aggregate({
        where: {
          ...where,
          status: "completed"
        },
        _sum: {
          agreedPrice: true
        }
      }),

      // Completed Orders
      this.prisma.exchanges.count({
        where: {
          ...where,
          status: "completed",
        }
      }),

      // Pending Review
      this.prisma.exchanges.count({
        where: {
          ...where,
          status: 'completed',
          reviews: {
            none: {}
          }
        },
      })
    ])

    const mapedData = data.map((d) => ({
      
    }))
    return {data, totalOrders, TotalSpent, CompltedOrders, PendingReviews};
  }
}
