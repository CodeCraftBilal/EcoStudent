import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item } from './types/types';
import { filter } from 'rxjs';

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
    let conditions: string[] = [];
    const params: any[] = [];
    let havingSQL = '';

    if (filters.category) {
      conditions.push(`c.categoryname = '${filters.category}'`);
      params.push(filters.category);
    }

    if (filters.minPrice) {
      conditions.push(`p.price >= ${filters.minPrice}`);
      params.push(Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      conditions.push(`p.price <= ${filters.maxPrice}`);
      params.push(Number(filters.maxPrice));
    }

    if (filters.condition) {
      const conditionsFilter = filters.condition;
      if (Array.isArray(conditionsFilter)) {
        conditionsFilter.forEach((c) => {
          conditions.push(`p.productcondition = '${c}'`);
        });
        console.log('array: ', conditionsFilter);
      } else {
        conditions.push(`p.productcondition = '${conditionsFilter}'`);
        console.log('non array: ', conditionsFilter);
      }
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    console.log('where sql: ', whereSQL);

    let lng: number = 0;
    let lat: number = 0;
    if (filters.lng && filters.lat && filters.maxdistance) {
      lng = Number(filters.lng);
      lat = Number(filters.lat);
      havingSQL = `
    HAVING (
      6371 * acos(
        cos(radians(${lat})) * cos(radians(u.latitude)) *
        cos(radians(u.longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(u.latitude))
      )
    ) <= ${Number(filters.maxdistance)}
  `;
    }

    try {
      const rawProducts: any[] = await this.prisma.$queryRawUnsafe(`
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
  ${whereSQL}
  ${havingSQL}
`);

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
    } catch (err) {
      console.log(err);
      return {
        error: true,
        success: false,
        message: `something went wrong!`,
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
