import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    console.log('data: ', userId, 'productId ', createFavoriteDto.productId);
    try {
      const isInFavorite = await this.prisma.user_favorites.findUnique({
        where: {
          userId_productId: {
            userId: userId,
            productId: createFavoriteDto.productId,
          },
        },
      });
      if (isInFavorite)
        return {
          error: true,
          alreadyInFavorite: true,
          message: `Already in favorite`,
        };
      await this.prisma.user_favorites.create({
        data: {
          productId: createFavoriteDto.productId,
          userId,
        },
      });
      return {
        error: false,
        message: 'Item added Successfuly',
      };
    } catch (err) {
      console.log(err);
      return {
        error: true,
        message: 'Item not added to favorites',
      };
    }
  }

  findAll(userId: number) {
    return this.prisma.user_favorites.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user_favorites.findUnique({
      where: {
        favoriteId: id,
      },
    });
  }

  async remove(productId: number, userId: any) {
    const favoriteItem = await this.prisma.user_favorites.findUnique({
      where: { 
        userId_productId: {
          productId,
          userId
        }
       },
    });
    if (favoriteItem?.userId === userId) {
      const deletedItem = await this.prisma.user_favorites.delete({
        where: {
          userId_productId: {
            productId,
            userId,
          }
        },
      });
      return {
        error: false,
        id: deletedItem.favoriteId,
        message: 'Removed Item successfuly',
      };
    } else {
      return {
        error: true,
        message: "Can't remove Item",
      };
    }
  }

  favoriteIds(userId: number) {
    return this.prisma.user_favorites.findMany({
      where: {
        userId,
      },
      select: {
        favoriteId: true,
      },
    });
  }

  async findFavoritesByUserId(userId: number, filters: any) {
    console.log('favorite filters ', filters);
    console.log('userId: ', userId);
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

      // sort filter
      const orderBy = (): string => {
        const map: Record<string, string> = {
          newest: 'ORDER BY sub.added_at DESC',
          oldest: 'ORDER BY sub.added_at ASC',
          'price-high': 'ORDER BY sub.price DESC',
          'price-low': 'ORDER BY sub.price ASC',
          'recently-added': 'ORDER BY sub.added_at DESC',
          distance: 'ORDER BY sub.distance ASC',
        };

        return map[filters.sortBy] || 'ORDER BY sub.added_at DESC';
      };

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

      // status filters

      if (filters.status) {
        conditions.push(`p.status = $${params.length + 1}::"PRODUCT_STATUS"`);
        params.push(filters.status);
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

      console.log('where sql: ', whereSQL);

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

      ${orderBy()}

      LIMIT ${limit}
      OFFSET ${offset}
    `,
        ...params,
      );

      // -------- COUNT QUERY ----------

      const [totalFavorites, availableItems, priceDrops] = await Promise.all([
        this.prisma.user_favorites.count({
          where: {
            userId,
          },
        }),
        this.prisma.user_favorites.count({
          where: {
            userId,
            product: {
              status: 'active',
            },
          },
        }),
        this.prisma.user_favorites.count({
          where: {
            userId,
            product: {
              status: 'sold',
            },
          },
        }),
      ]);
      // ---------------- MAP TO FRONTEND TYPE ----------------
      const favorites = rawFavorites.map((p) => ({
        id: p.productid.toString(),
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalprice ? Number(p.originalprice) : undefined,
        category: p.categoryname ?? '',
        condition: p.productcondition,
        image: Array.isArray(p.images) ? p.images[0] : undefined,
        distance: p.distance ? Number(Number(p.distance).toFixed(1)) : 0,
        seller: {
          id: p.userid.toString(),
          name: p.username,
          profilePicture: p.profilepicture || '',
          rating: p.rating ? Number(p.rating) : 0,
          verified: Boolean(p.isverified),
        },
        exchangeType: p.exchangetype,
        favorite: {
          favoriteId: p.favoriteid.toString(),
          addedAt: p.added_at,
          status: p.status,
          location: p.userlocation || '',
        },
      }));

      return {
        totalFavorites,
        availableItems,
        priceDrops,
        nearbyItems: 0,
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
}
