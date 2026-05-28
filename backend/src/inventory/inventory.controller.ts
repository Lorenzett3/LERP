import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('movements')
  movements() {
    return this.inventoryService.movements();
  }

  @Post('movements')
  postMovement(@Body() body: { productSku: string; type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'; quantity: number; reference: string }) {
    return this.inventoryService.postMovement(body);
  }
}
