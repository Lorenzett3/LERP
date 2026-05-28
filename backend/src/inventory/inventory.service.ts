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

  updateMovement(id: string, input: { productSku?: string; type?: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'; quantity?: number; reference?: string }) {
    const movement = this.data.movements.find((item) => item.id === id);
    if (!movement) {
      throw new NotFoundException('Documento MM nao encontrado.');
    }

    const productSku = input.productSku ?? movement.productSku;
    const product = this.data.products.find((item) => item.sku === productSku);
    if (!product) {
      throw new NotFoundException('Material nao encontrado para movimento MM.');
    }

    Object.assign(movement, {
      ...input,
      productSku,
      productName: product.name,
    });
    return movement;
  }

  removeMovement(id: string) {
    const index = this.data.movements.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Documento MM nao encontrado.');
    }

    const [removed] = this.data.movements.splice(index, 1);
    return removed;
  }
}
