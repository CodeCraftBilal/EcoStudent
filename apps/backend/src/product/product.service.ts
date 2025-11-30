import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item } from './types/types';
import { Prisma } from '@prisma/client';

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
    const conditions: string[] = [];
    const params: any[] = [];

    console.log('filters ', filters);
    if (filters.category) {
      const categories = Array.isArray(filters.category)
        ? filters.category
        : [filters.category];

      const placeholders = categories
        .map((_, i) => `$${params.length + i + 1}`)
        .join(', ');

      conditions.push(`c.categoryname IN (${placeholders})`);
      params.push(...categories);
    }

    // Condition filter (single or array)
    if (filters.condition) {
      const conditionsArr = Array.isArray(filters.condition)
        ? filters.condition
        : [filters.condition];

      conditions.push(
        `p.productcondition = ANY($${params.length + 1}::product_condition[])`,
      );

      params.push(conditionsArr);
    }

    // exchangeType filter (single or array)
    if (filters.exchangeType) {
      const exchangeArr = Array.isArray(filters.exchangeType)
        ? filters.exchangeType
        : [filters.exchangeType];

      conditions.push(
        `p.exchangetype = ANY($${params.length + 1}::exchange_type[])`,
      );

      params.push(exchangeArr);
    }

    // Min price filter
    if (filters.minPrice) {
      conditions.push(`p.price >= $${params.length + 1}`);
      params.push(Number(filters.minPrice));
    }

    // Max price filter
    if (filters.maxPrice) {
      conditions.push(`p.price <= $${params.length + 1}`);
      params.push(Number(filters.maxPrice));
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    console.log('whereSql: ', whereSQL);
    // Latitude & Longitude
    const lat = filters.lat ? Number(filters.lat) : null;
    const lng = filters.lng ? Number(filters.lng) : null;

    // Max distance
    const maxDistance = filters.maxDistance
      ? Number(filters.maxDistance)
      : null;

    try {
      const rawProducts: any[] = await this.prisma.$queryRawUnsafe(
        `
      SELECT *
      FROM (
        SELECT
          p.productid,
          p.title,
          p.description,
          p.images,
          p.price,
          p.originalprice,
          p.productcondition,
          p.exchangetype,
          p.created_at,
          p.updated_at,
          c.categoryname,
          u.username AS seller_name,
          u.isverified,
          u.rating,
          u.profilepicture,
          ${
            lat !== null && lng !== null
              ? `(6371 * acos(
                   cos(radians(${lat})) * cos(radians(u.latitude)) *
                   cos(radians(u.longitude) - radians(${lng})) +
                   sin(radians(${lat})) * sin(radians(u.latitude))
                 ))`
              : '0'
          } AS distance
        FROM product p
        LEFT JOIN category c ON p.categoryid = c.categoryid
        LEFT JOIN users u ON p.userid = u.userid
        ${whereSQL}
      ) AS sub
      ${maxDistance !== null ? `WHERE sub.distance <= ${maxDistance}` : ''}
      ORDER BY distance ASC
    `,
        ...params,
      );

      console.log(rawProducts)

      return rawProducts.map((p) => ({
        id: p.productid.toString(),
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalprice ? Number(p.originalprice) : undefined,
        category: p.categoryname,
        condition: p.productcondition,
        image: Array.isArray(p.images) ? p.images[0] : null,
        distance: p.distance ? Number(Number(p.distance).toFixed(1)) : 0,
        seller: {
          name: p.seller_name,
          rating: p.rating ? Number(p.rating) : 0,
          verified: Boolean(p.isverified),
          profilePicture: p.profilepicture,
        },
        exchangeType: p.exchangetype,
      }));
    } catch (err) {
      console.error('findAll error:', err);
      return {
        error: true,
        success: false,
        message: 'Something went wrong!',
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
