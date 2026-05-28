import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('low-stock')
  lowStock() {
    return this.productsService.lowStock();
  }

  @Post()
  create(@Body() body: { sku: string; name: string; category: string; price: number; stock: number }) {
    return this.productsService.create(body);
  }

  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() body: { stock: number }) {
    return this.productsService.updateStock(id, body.stock);
  }
}
