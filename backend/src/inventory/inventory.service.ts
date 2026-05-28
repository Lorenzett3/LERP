import { Injectable, NotFoundException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class InventoryService {
  constructor(private readonly data: ErpDataService) {}

  movements() {
    return this.data.movements;
  }

  postMovement(input: { productSku: string; type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'; quantity: number; reference: string }) {
    const product = this.data.products.find((item) => item.sku === input.productSku);
    if (!product) {
      throw new NotFoundException('Material nao encontrado para movimento MM.');
    }

    const signedQuantity = input.type === 'OUTBOUND' ? -Math.abs(input.quantity) : input.quantity;
    product.stock += signedQuantity;

    const movement = {
      id: `MM-${Math.floor(Math.random() * 90000 + 10000)}`,
      productName: product.name,
      postedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...input,
      quantity: signedQuantity,
    };
    this.data.movements.unshift(movement);
    return movement;
  }
}
