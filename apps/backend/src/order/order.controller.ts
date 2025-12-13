import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    console.log('createOrderDto ', createOrderDto )
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
  findAll(@Query() query) {
    return this.orderService.findAll(query.page);
  }

  @Get('purchases')
  purchases(@Req() req) {
    return this.orderService.getAllByBuyerId(req.user.id);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Get('cancel/:id')
  cancelOrder(@Param('id') id:string, @Req() req) {
    return this.orderService.cancelOrder(+id, req.user.id);
  }

}
