import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @GetUser() user: { id: string },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.id, dto.address, dto.phone);
  }

  @Get()
  getUserOrders(@GetUser() user: { id: string }) {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Delete(':id')
  deleteOrder(
    @GetUser() user: { id: string; role: string },
    @Param('id') id: string,
  ) {
    return this.ordersService.deleteOrder(user.id, id, user.role);
  }
}
