import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item } from './types/types';

@Injectable()
export class ProductService {
  async findFavorits(id: number, query: any) {
    try {
      return await this.prisma.product.findMany({
        include: {
          userFavorites: {
            select: {
              product: {
                where: {
                  userFavorites: { some: query },
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    console.log('product : ', createProductDto);
    console.log('userId ', createProductDto.userId);

    try {
      const categoryId = await this.prisma.category.findUnique({
        where: { categoryName: createProductDto.productType },
        select: { categoryId: true },
      });

      if (!categoryId) return { success: false, message: 'Invalid category!' };

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          originalPrice: parseInt(createProductDto.originalPrice),
          price: parseInt(createProductDto.price),
          categoryId: categoryId.categoryId,
        },
      });
      return {
        success: true,
        error: false,
        message: 'Product uploaded Successfuly',
        productId: product.productId,
      };
    } catch (err) {
      console.log('product upload error: ', err);
      return { success: false, message: 'something went wrong!' };
    }
  }

  async findAll(filters: any) {
    const where: any = {};

    // Filter by category
    if (filters.category) {
      where.category = { categoryName: filters.category };
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }

    // Filter by condition (array)
    if (filters.condition) {
      const conditionArray = Array.isArray(filters.condition)
        ? filters.condition
        : filters.condition.split(',');
      where.productCondition = { in: conditionArray };
    }

    // Filter by exchangeType (array)
    if (filters.exchangeType) {
      const exchangeArray = Array.isArray(filters.exchangeType)
        ? filters.exchangeType
        : filters.exchangeType.split(',');
      where.exchangeType = { in: exchangeArray };
    }

    // latitude and longitude
    if (filters.lat && filters.lng) {
      where.lat = filters.lat;
      where.lng = filters.lng;
    }

    const lat = Number(where.lat);
    const lng = Number(where.lng);
    console.log('lat ', lat, 'lng', lng);

    console.log('where: ', where);
    try {
      const rawProducts: any[] = await this.prisma.$queryRaw`
  SELECT 
    p.productid,
    p.title,
    p.description,
    p.price,
    p.originalprice,
    p.images,
    p.productcondition,
    p.producttype,
    p.created_at,
    p.updated_at,
    c.categoryname,
    u.username AS seller_name,
    u.isverified,
    u.rating,
    u.profilepicture,
    (
           6371 * acos(
             cos(radians(${lat})) * cos(radians(u.latitude)) *
             cos(radians(u.longitude) - radians(${lng})) +
             sin(radians(${lat})) * sin(radians(u.latitude))
           )
         ) AS distance
  FROM product p
  LEFT JOIN category c ON p.categoryid = c.categoryid
  LEFT JOIN users u ON p.userid = u.userid
`;

      console.log(rawProducts);

      const product: Item[] = rawProducts.map((p: any) => ({
        id: p.productid.toString(),
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalprice ? Number(p.originalprice) : undefined,
        category: p.categoryname,
        condition: p.productcondition,
        image: Array.isArray(p.images) ? p.images[0] : null, // if images is JSON array
        distance: p.distance ? Number(Number(p.distance).toFixed(1)) : 0, // You did not calculate it yet (optional)
        rating: p.seller_rating ? Number(p.seller_rating) : 0,
        seller: {
          name: p.seller_name,
          rating: p.rating ? Number(p.rating) : 0,
          verified: Boolean(p.isverified),
          profilePicture: p.profilepicture,
        },
        exchangeType: p.producttype, // If your product type maps directly
      }));

      return product;

      // TODO: distance filter requires location logic if you have latitude/longitude
    } catch (err) {
      console.log(err);
      return {
        error: true,
        success: false,
        message: `something went wrong! ${err}`,
      };
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.product.findUnique({
        where: { productId: id },
      });
    } catch (err) {
      console.log('Product FindOne: ', err);
      return { success: true, error: true, message: 'product not found!' };
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { userId, categoryId, images, price, originalPrice, ...rest } =
        updateProductDto;
      let newPrice: number = 0;
      let newOrignalPrice: number = 0;
      if (price && originalPrice) {
        newPrice = parseInt(price);
        newOrignalPrice = parseInt(originalPrice);
      }
      return this.prisma.product.update({
        where: { productId: id },
        data: {
          ...rest,
          price: newPrice,
          originalPrice: newOrignalPrice,
        },
      });
    } catch (err) {
      console.log('product update err: ', err);
      return {
        success: true,
        error: false,
        message: 'product not found!',
      };
    }
  }

  remove(id: number) {
    try {
      return this.prisma.product.delete({
        where: { productId: id },
      });
    } catch (err) {
      return {
        success: false,
        error: true,
        message: 'some error occured',
      };
    }
  }
}
