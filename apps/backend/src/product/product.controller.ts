import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UploadService } from 'src/upload/upload.service';
import { useGCS } from 'src/upload/constants/constants';
import { Public } from 'src/auth/decorators/public.decorator';
import type { FindByUIDParams } from './types/types';
import type { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: multer.memoryStorage(),
      // 2MB limit
      limits: { fileSize: 2 * 1024 * 1024 },
      // Allow only images
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only images allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Req() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('createProductDto: ', createProductDto);
    const imageUrls = await Promise.all(
      files.map((file) => {
        return useGCS
          ? this.uploadService.uploadToGCS(file, 'products')
          : this.uploadService.uploadToLocal(file, 'products');
      }),
    );

    return this.productService.create(
      {
        ...createProductDto,
        images: imageUrls,
      },
      req.user.id,
    );
  }

  @Get('mylisting')
  findProductByUserId(@Query() query: FindByUIDParams, @Req() req) {
    return this.productService.findProductByUserId(req.user.id, query);
  }

  @Post('analyze-image')
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 4 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Only images allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async analyzeImage(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image provided');
    }
    return this.productService.analyzeImage(files[0]);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Public()
  @Get('v2')
  findAll_v2(@Query() query: any, @Req() req: Request) {
    let userId = null;

    // 1. Try Authorization Header
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    let token: string | null = null;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Else: Try Cookie
    else if (req.cookies && req.cookies['access_token']) {
      token = req.cookies['access_token']; // cookie name
    }

    // Decode token if found
    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
        userId = payload.sub;
      } catch (e) {}
    }

    // Use userId if exists
    if (userId) {
      return this.productService.getRecommendationsFromAI(userId, query);
    }

    return this.productService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any, @Req() req: any) {
    // Extract viewer IP for throttling fake rapid increments
    const viewerId = req.ip || req.connection?.remoteAddress || 'unknown';
    
    // Call service method and return response
    return this.productService.getProductAndIncrementView(+id, query, viewerId);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, {
      ...updateProductDto,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
