import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindByUIDParams, Item } from './types/types';
import { Prisma } from '@prisma/client';
import { error } from 'console';

@Injectable()
export class ProductService {
  async findFavoritesByUserId(
  userId: number,
  filters: any,
) {
  try {
    const conditions: string[] = [];
    const params: any[] = [];

    // Pagination
    const limit = filters.limit ? Number(filters.limit) : 10;
    const page = filters.page ? Number(filters.page) : 1;
    const offset = (page - 1) * limit;

    // Mandatory favorite filter
    conditions.push(`uf.userid = $${params.length + 1}`);
    params.push(userId);

    // Search
    if (filters.search) {
      conditions.push(`p.title ILIKE '%' || $${params.length + 1} || '%'`);
      params.push(filters.search);
    }

    // Category
    if (filters.category) {
      conditions.push(`p.categoryid = $${params.length + 1}`);
      params.push(Number(filters.category));
    }

    // Condition
    if (filters.condition) {
      conditions.push(
        `p.productcondition = $${params.length + 1}::product_condition`,
      );
      params.push(filters.condition);
    }

    // Price filters
    if (filters.minPrice) {
      conditions.push(`p.price >= $${params.length + 1}`);
      params.push(Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      conditions.push(`p.price <= $${params.length + 1}`);
      params.push(Number(filters.maxPrice));
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // Geo filters
    const lat = filters.lat ? Number(filters.lat) : null;
    const lng = filters.lng ? Number(filters.lng) : null;

    const maxDistance = filters.maxDistance
      ? Number(filters.maxDistance)
      : null;

    // Distance SQL
    const distanceSQL =
      lat !== null && lng !== null
        ? `(6371 * acos(
              cos(radians(${lat})) * cos(radians(u.latitude)) *
              cos(radians(u.longitude) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(u.latitude))
           ))`
        : '0';

    // ---------------- RAW QUERY ----------------
    const rawFavorites: any[] = await this.prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM (
        SELECT
          uf.favoriteid,
          uf.created_at AS added_at,

          p.productid,
          p.title,
          p.description,
          p.images,
          p.price,
          p.originalprice,
          p.productcondition,
          p.exchangetype,
          p.status,
          p.views,
          p.created_at,

          c.categoryname,

          u.userid,
          u.username,
          u.profilepicture,
          u.rating,
          u.isverified,
          u.userlocation,

          ${distanceSQL} AS distance

        FROM user_favorites uf
        JOIN product p ON uf.productid = p.productid
        LEFT JOIN users u ON p.userid = u.userid
        LEFT JOIN category c ON p.categoryid = c.categoryid

        ${whereSQL}
      ) AS sub

      ${maxDistance !== null ? `WHERE sub.distance <= ${maxDistance}` : ''}

      ORDER BY sub.added_at DESC

      LIMIT ${limit}
      OFFSET ${offset}
    `,
      ...params,
    );

    // -------- COUNT QUERY ----------
    const countResult: any[] = await this.prisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)
      FROM user_favorites uf
      JOIN product p ON uf.productid = p.productid
      ${whereSQL}
    `,
      ...params,
    );

    const total = Number(countResult[0].count);

    // ---------------- MAP TO FRONTEND TYPE ----------------
    const favorites = rawFavorites.map((p) => ({
      id: p.favoriteid.toString(),
      addedAt: p.added_at,
      item: {
        id: p.productid.toString(),
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalprice
          ? Number(p.originalprice)
          : undefined,
        image: Array.isArray(p.images) ? p.images[0] : '',
        category: p.categoryname ?? '',
        condition: p.productcondition,
        status: p.status,
        exchangeType: p.exchangetype,

        seller: {
          id: p.userid.toString(),
          name: p.username,
          avatar: p.profilepicture || '',
          rating: p.rating ? Number(p.rating) : 0,
          verified: Boolean(p.isverified),
        },

        location: p.userlocation || '',
        distance: p.distance ? Number(Number(p.distance).toFixed(1)) : 0,
        views: Number(p.views ?? 0),
        createdAt: p.created_at,
      },
    }));

    return {
      page,
      limit,
      total,
      hasMore: offset + favorites.length < total,
      data: favorites,
    };
  } catch (err) {
    console.error('findFavoritesByUserId error:', err);
    return {
      error: true,
      success: false,
      message: 'Failed to fetch favorites',
    };
  }
}

  /**
   * ADD TO FAVORITES
   */
  async addToFavorites(userId: number, productId: number) {
    return this.prisma.user_favorites.create({
      data: {
        favoriteId: Date.now(),
        userId,
        productId,
      }
    });
  }

  /**
   * REMOVE FAVORITE
   */
  async removeFromFavorites(userId: number, productId: number) {
    return this.prisma.user_favorites.deleteMany({
      where: {
        userId,
        productId
      }
    });
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

    // Pagination values
    const limit = filters.limit ? Number(filters.limit) : 10;
    const offset = filters.offset ? Number(filters.offset) : 0;

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
          u.userid,
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
      LIMIT ${limit}
      OFFSET ${offset}
    `,
        ...params,
      );

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
          id: p.userid,
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

  async findOne(id: number, filters: any) {
    console.log('filters ', filters);
    console.log('id: ', id);
    const lat = filters.lat ? Number(filters.lat) : null;
    const lng = filters.lng ? Number(filters.lng) : null;
    try {
      const rawProduct: any[] = await this.prisma.$queryRaw`
  SELECT 
    p.productid,
    p.title,
    p.description,
    p.price,
    p.originalprice,
    p.productcondition,
    p.images,
    p.created_at,
    p.viewcount,
    p.producttype,
    c.categoryname,
    u.userid,
    u.username,
    u.rating,
    u.created_at AS userCreatedAt,
    u.profilepicture,
    u.userlocation,
    u.latitude,
    u.longitude,
    (
      6371 * acos(
        cos(radians(${lat}))
        * cos(radians(u.latitude))
        * cos(radians(u.longitude) - radians(${lng}))
        + sin(radians(${lat})) * sin(radians(u.latitude))
      )
    ) AS distance
  FROM product p
  JOIN users u ON p.userid = u.userid
  JOIN category c ON p.categoryid = c.categoryid
  WHERE p.productid = ${id}
`;

      console.log('raw product lenght', rawProduct.length);
      if (rawProduct.length > 0)
        return rawProduct.map((p) => ({
          id: p.productid,
          title: p.title,
          description: p.description,
          price: Number(p.price),
          originalPrice: p.originalprice ? Number(p.originalprice) : undefined,
          condition: p.productcondition,
          images: p.images,
          postedDate: p.created_at,
          views: p.viewcount ? Number(p.viewcount) : 0,
          category: p.categoryname,
          distance: p.distance ? Number(Number(p.distance).toFixed(1)) : 0,
          seller: {
            id: p.userid,
            name: p.username,
            rating: p.rating ? Number(p.rating) : 0,
            verified: p.isverified ?? false,
            reviewCount: p.reviewcount ?? 0,
            memberSince: p.userCreatedAt ?? '0',
            avatar: p.profilepicture ?? '',
          },
          location: {
            address: p.userlocation,
            latitude: p.latitude,
            longitude: p.longitude,
          },
        }));
      else
        return {
          error: true,
          success: false,
          message: 'no product found',
        };
    } catch (err) {
      console.log('Product FindOne: ', err);
      return { success: false, error: true, message: 'product not found!' };
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

  async remove(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {productId: id}
      })

      if(product?.status == 'reserved') {
        return {
          error: true,
          message: 'This action can\'t be done. Your order is in Progress'
        }
      }
      await this.prisma.product.delete({
        where: { productId: id },
      });

      return {
        error: false,
        message: 'Item deleted successfuly'
      }
    } catch (err) {
      return {
        success: false,
        error: true,
        message: 'some error occured',
      };
    }
  }

  async findProductByUserId(
    userId: number,
    {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      category,
      condition,
      sortBy = 'latest',
    }: FindByUIDParams,
  ) {
    const skip = Number((page - 1) * limit);

    /** Build dynamic WHERE clause */
    const basewhere: any = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),

      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),

      ...(condition && {
        productCondition: condition,
      }),

      ...(category && {
        category: {
          is: {
            categoryName: category,
          },
        },
      }),
    };

    console.log('wehre: ', basewhere);
    /** Sorting */
    const orderBy =
      sortBy === 'price-asc'
        ? { price: 'asc' as const }
        : sortBy === 'price-desc'
          ? { price: 'desc' as const }
          : { createdAt: 'desc' as const }; // default latest

    /** Run queries */
    try {
      const [
        rawProducts,
        totalCount,
        activeCount,
        soldCount,
        draftCount,
        reservedCount,
      ] = await Promise.all([
        this.prisma.product.findMany({
          where: basewhere,
          skip,
          take: Number(limit),
          orderBy,
          select: {
            productId: true,
            title: true,
            description: true,
            price: true,
            originalPrice: true,
            images: true,
            status: true,
            category: {
              select: {
                categoryName: true,
              },
            },
            productCondition: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
            exchangeType: true,
          },
        }),
        // total
        this.prisma.product.count({
          where: basewhere,
        }),
        // active
        this.prisma.product.count({
          where: {
            ...basewhere,
            status: 'active',
          },
        }),
        // sold
        this.prisma.product.count({
          where: {
            ...basewhere,
            status: 'sold',
          },
        }),
        // draft
        this.prisma.product.count({
          where: {
            ...basewhere,
            status: 'draft',
          },
        }),
        // reserved
        this.prisma.product.count({
          where: {
            ...basewhere,
            status: 'reserved',
          },
        }),
      ]);
      const products = rawProducts.map((p) => ({
        id: p.productId,
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        image: p.images ? p.images[0] : null,
        status: p.status,
        category: p.category?.categoryName,
        condition: p.productCondition,
        views: p.viewCount,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        exchangeType: p.exchangeType,
      }));

      return {
        items: products,
        stats: {
          totalCount,
          activeCount,
          soldCount,
          draftCount,
          reservedCount,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        error: true,
        message: 'something went wrong!',
      };
    }
  }
}
