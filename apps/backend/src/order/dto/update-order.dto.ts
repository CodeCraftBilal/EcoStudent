import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { exchange_status } from 'generated/prisma';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    status: exchange_status
}
