import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UpdateReviewDto } from 'src/review/dto/update-review.dto';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    console.log("Creating order with data:", createOrderDto);
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query() query) {
    return this.orderService.findAll(query.page);
  }

  @Get('purchases')
  purchases(@Req() req, @Query() query) {
    return this.orderService.getAllByBuyerId(req.user.id, query);
  }

  @Get('cancel/:id')
  cancelOrder(@Param('id') id: string, @Req() req) {
    return this.orderService.cancelOrder(+id, req.user.id);
  }

  @Patch('purchases/rate')
  review(@Param('id') id, @Body() body: CreateReviewDto) {
    return this.orderService.createReview(body);
  }

  @Get('conversation/:conversationId')
  async getOrderByConversation(
    @Param('conversationId') conversationId: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.orderService.findByConversation(
      parseInt(conversationId),
      userId,
    );
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.orderService.updateStatus(parseInt(id), status, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.orderService.update(parseInt(id), updateOrderDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
