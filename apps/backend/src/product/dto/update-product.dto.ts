import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { status } from 'generated/prisma';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    status: status
}
