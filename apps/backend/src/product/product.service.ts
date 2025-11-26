import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  async findFavorits(id: number, query: any) {
    try{

      return await this.prisma.product.findMany({
        include: {
        userFavorites: {
          select: {
            product: {
              where: {
                userFavorites: {some:query}
              }
            }
          }
        }
      }
    });
  } catch(err) {
    console.log(err)
    return [];
  }
  }

  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    console.log('product : ', createProductDto)
    console.log('userId ', createProductDto.userId)

    try {

      const categoryId = await this.prisma.category.findUnique({
        where: {categoryName: createProductDto.productType},
        select: {categoryId: true}
      })

      if(!categoryId) return {success: false, message: 'Invalid category!'}

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          originalPrice: parseInt(createProductDto.originalPrice),
          price: parseInt(createProductDto.price),
          categoryId: categoryId.categoryId
        }
      })
      return {success: true, error: false, message: 'Product uploaded Successfuly', productId: product.productId};
    } catch (err) {
      console.log('product upload error: ', err)
      return {success: false, message: 'something went wrong!'}
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

  // TODO: distance filter requires location logic if you have latitude/longitude

  return this.prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          categoryId: true,
          categoryName: true
        }
      },
      users: {
        select: {
          userId: true,
          userName: true,
          rating: true,
          isVerified: true,
          longitude: true,
          latitude: true
        }
      }
    },
  });
}


  findOne(id: number) {
    try {
      return this.prisma.product.findUnique({
        where: {productId: id}
      });
    } catch(err) {
      console.log('Product FindOne: ', err)
      return {success: true, error: true, message: 'product not found!'}
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try{
    const {userId,categoryId, images, price, originalPrice , ...rest} = updateProductDto;
    let newPrice: number = 0;
    let newOrignalPrice: number = 0;
    if(price && originalPrice){
      newPrice = parseInt(price)
      newOrignalPrice = parseInt(originalPrice)
      }
    return this.prisma.product.update({
      where: {productId: id},
      data: {
        ...rest,
        price: newPrice,
        originalPrice: newOrignalPrice
      },
    })
  }
  catch(err) {
    console.log('product update err: ', err)
    return {
      success: true,
      error: false,
      message: 'product not found!'
    }
  }
  }

  remove(id: number) {
    try {
      return this.prisma.product.delete({
        where: {productId: id}
      })

    }
    catch(err) {
      return {
        success: false,
        error: true,
        message: 'some error occured'
      }
    }
  }
}
