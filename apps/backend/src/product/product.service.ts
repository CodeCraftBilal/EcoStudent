import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindByUIDParams } from './types/types';
import { PRODUCT_STATUS } from 'generated/prisma';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto, userId: number) {
    try {
      const categoryId = await this.prisma.category.findUnique({
        where: { categoryName: createProductDto.productType },
        select: { categoryId: true },
      });

      if (!categoryId) return { success: false, message: 'Invalid category!' };

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
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
      console.error('Product Upload Error: ', err);
      return { success: false, message: 'something went wrong!' };
    }
  }

  async generateEmbedding(productId: number, file: Express.Multer.File) {
    console.log(`Generating embedding for product ${productId}`);
    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(file.buffer);

      const blob = new Blob([uint8Array], {
        type: file.mimetype,
      });
      formData.append('file', blob, file.originalname);
      formData.append('productId', productId.toString());

      const fastApiUrl = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${fastApiUrl}/embeddings/product`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`FastAPI responded with ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Log failures without breaking product upload
      console.error('Error generating product embedding:', error);
      return { success: false, message: 'Failed to generate embedding' };
    }
  }

  async findAll(filters: any) {
    console.log('filters: ', filters);
    const conditions: string[] = [];
    const params: any[] = [];

    conditions.push(`p.status = 'active'`);

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

    // Search filter (title + description)
    if (filters.searchQuery) {
      conditions.push(
        `p.search_vector @@ plainto_tsquery('english', $${params.length + 1})`,
      );
      params.push(filters.searchQuery);
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

    // Latitude & Longitude
    const lat = filters.lat ? Number(filters.lat) : null;
    const lng = filters.lng ? Number(filters.lng) : null;

    // Max distance
    const maxDistance = filters.maxDistance
      ? Number(filters.maxDistance)
      : null;

    console.log('whereSql: ', whereSQL);
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
          COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.revieweduserid = u.userid), 0) AS rating,
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

      if (rawProducts.length == 0) console.log('no product found');

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
          rating: p.rating ? Number(p.rating).toFixed(1) : 0,
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

  // Simple in-memory cache to prevent fake rapid increments
  private readonly viewCache = new Map<string, number>();

  async getProductAndIncrementView(
    id: number,
    filters: any,
    viewerId?: string,
  ) {
    const now = Date.now();
    let shouldIncrement = true;

    // 6. Prevent fake rapid increments
    if (viewerId) {
      const cacheKey = `${id}_${viewerId}`;
      const lastViewed = this.viewCache.get(cacheKey);

      // Ignore multiple requests from same user within 5 seconds (5000ms)
      if (lastViewed && now - lastViewed < 5000) {
        shouldIncrement = false;
      } else {
        this.viewCache.set(cacheKey, now);
      }
    }

    if (shouldIncrement) {
      try {
        // 2. Increment viewCount using Prisma atomic operation
        // Prisma natively treats NULL as 0 for increments in recent versions
        await this.prisma.product.update({
          where: { productId: id },
          data: {
            viewCount: { increment: 1 },
          },
        });
      } catch (error: any) {
        // 1. Check if product exists (Prisma throws P2025 if record not found)
        if (error.code === 'P2025') {
          throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        throw error;
      }
    }

    // 3. Return updated product
    // We reuse findOne because it contains raw SQL to calculate distance and ratings.
    // A single query is not possible without losing those calculated fields or writing
    // a complex raw UPDATE ... RETURNING query which violates the atomic { increment: 1 } requirement.
    const product = await this.findOne(id, filters);

    if (!Array.isArray(product) && product.error) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getRecommendationsFromAI(userId: number, filters: any) {
    console.log('Getting recommendations');
    const fastApiUrl = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:5000';
    try {
      const params = new URLSearchParams();
      if (filters.searchQuery)
        params.append('searchQuery', filters.searchQuery);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.maxDistance)
        params.append('maxDistance', filters.maxDistance);
      if (filters.lat) params.append('lat', filters.lat);
      if (filters.lng) params.append('lng', filters.lng);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      if (filters.category) {
        const categories = Array.isArray(filters.category)
          ? filters.category
          : [filters.category];
        categories.forEach((c) => params.append('category', c));
      }

      if (filters.condition) {
        const conditions = Array.isArray(filters.condition)
          ? filters.condition
          : [filters.condition];
        conditions.forEach((c) => params.append('condition', c));
      }

      if (filters.exchangeType) {
        const exchanges = Array.isArray(filters.exchangeType)
          ? filters.exchangeType
          : [filters.exchangeType];
        exchanges.forEach((e) => params.append('exchangeType', e));
      }

      const res = await fetch(
        `${fastApiUrl}/recommendations/${userId}?${params.toString()}`,
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('AI Recommendation Error:', err);
    }
    // Fallback to normal findAll if AI fails
    console.log(
      'findAll is running b/c there was an error in get recommendation',
    );
    return this.findAll(filters);
  }

  async findAll_v2(query: string) {
    const fastApiUrl = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:5000';
    const params = query.split('?');
    const res = await fetch(`${fastApiUrl}/recommendation/userid?${params[1]}`);
    const products = await res.json();
    return products;
  }

  async findOne(id: number, filters: any) {
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
    COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.revieweduserid = u.userid), 0) AS rating,
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
            rating: p.rating ? Number(p.rating).toFixed(1) : 0,
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
        where: { productId: id },
      });

      if (product?.status == 'reserved') {
        return {
          error: true,
          message: "This action can't be done. Your order is in Progress",
        };
      }
      await this.prisma.product.delete({
        where: { productId: id },
      });

      return {
        error: false,
        message: 'Item deleted successfuly',
      };
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
      return {
        error: true,
        message: 'something went wrong!',
      };
    }
  }

  async updateProductStatus(productId: number, status: string) {
    await this.prisma.product.update({
      where: { productId: productId },
      data: { status: status as PRODUCT_STATUS },
    });
  }

  async analyzeImage(file: Express.Multer.File) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `Analyze this product image and extract the following details in JSON format.
      Fields to extract:
      - title: A descriptive title for the product (min 10 max 100 characters).
      - description: A detailed description of the product condition and features.
      - price: Estimated selling price in numbers.
      - originalPrice: Estimated original price in numbers.
      - category: Choose exactly one from ["books", "uniform", "calculator", "geometry", "bag", "other"].
      - subCategory: If category is "other", provide a subcategory (3 to 30 characters), else empty string.
      - condition: Choose exactly one from ["excellent", "good", "fair"].

      Respond with ONLY the raw JSON object, without markdown formatting or backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          prompt,
          {
            inlineData: {
              data: file.buffer.toString('base64'),
              mimeType: file.mimetype,
            },
          },
        ],
      });

      const text = response.text || '';
      const cleanedText = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const result = JSON.parse(cleanedText);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      console.error('Image Analysis Error: ', err);
      return { success: false, message: 'Failed to analyze image' };
    }
  }

  async searchByImage(file: Express.Multer.File, page: number, limit: number) {
    console.log("searching by images")
    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(file.buffer);

      const blob = new Blob([uint8Array], {
        type: file.mimetype,
      });
      formData.append('file', blob, file.originalname);

      const offset = (page - 1) * limit;

      const fastApiUrl =
        process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${fastApiUrl}/image-search?limit=${limit}&offset=${offset}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`FastAPI responded with ${response.status}`);
      }

      const data = await response.json();

      // Map properties to match frontend Item interface structure if needed
      const matches = data.matches?.map((p) => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.originalprice ? Number(p.originalprice) : undefined,
        category: p.category,
        condition: p.condition,
        image: Array.isArray(p.images) ? p.images[0] : null,
        exchangeType: p.exchangetype,
        similarity: p.similarity,
      }));

      return matches || []
    } catch (error) {
      console.error('Error in AI Image Search Service:', error);
      throw new HttpException(
        'Failed to search products by image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
