import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Patch('movements/:id')
  updateMovement(@Param('id') id: string, @Body() body: { productSku?: string; type?: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'; quantity?: number; reference?: string }) {
    return this.inventoryService.updateMovement(id, body);
  }

  @Delete('movements/:id')
  removeMovement(@Param('id') id: string) {
    return this.inventoryService.removeMovement(id);
  }
}
