import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() body: { customer: string; channel: 'STORE' | 'B2B' | 'ECOMMERCE'; total: number }) {
    return this.ordersService.create(body);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() body: { status: 'DRAFT' | 'APPROVAL' | 'PICKING' | 'INVOICED' }) {
    return this.ordersService.changeStatus(id, body.status);
  }
}
