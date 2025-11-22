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
import multer, { diskStorage } from 'multer';
import { UploadService } from 'src/upload/upload.service';
import { useGCS } from 'src/upload/constants/constants';
import { Public } from 'src/auth/decorators/public.decorator';

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
    console.log('files recieved: ', files.length);
    console.log(req.user)
    const imageUrls = await Promise.all(
      files.map((file) => {
        return useGCS
          ? this.uploadService.uploadToGCS(file, 'products')
          : this.uploadService.uploadToLocal(file, 'products');
      }),
    );

    return this.productService.create({...createProductDto, userId: req.user.id , images: imageUrls, });
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Req() req,@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    console.log(updateProductDto)
    return this.productService.update(+id, {...updateProductDto, userId: req.user.id});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
