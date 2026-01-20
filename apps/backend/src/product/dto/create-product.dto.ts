import { IsEnum, IsNumber, isNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { product_condition, product_type } from 'generated/prisma';

export class CreateProductDto {

  @IsOptional()
  @IsNumber()
  userId?: number

  @IsOptional()
  @IsNumber()
  categoryId: number

  @IsString()
  @MinLength(10)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsEnum(product_condition)
  @MaxLength(20)
  productCondition: product_condition;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  originalPrice: string;

  @IsString()
  @MaxLength(30)
  productType: product_type;

  images?: string[];
}
