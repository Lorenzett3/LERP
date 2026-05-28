import { Injectable, NotFoundException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class OrdersService {
  constructor(private readonly data: ErpDataService) {}

  findAll() {
    return this.data.orders;
  }

  create(input: { customer: string; channel: 'STORE' | 'B2B' | 'ECOMMERCE'; total: number }) {
    const order = {
      id: `SO-${Math.floor(Math.random() * 900000 + 100000)}`,
      status: 'DRAFT' as const,
      createdAt: new Date().toISOString().slice(0, 10),
      ...input,
    };
    this.data.orders.unshift(order);
    return order;
  }

  changeStatus(id: string, status: 'DRAFT' | 'APPROVAL' | 'PICKING' | 'INVOICED') {
    const order = this.data.orders.find((item) => item.id === id);
    if (!order) {
      throw new NotFoundException('Pedido nao encontrado.');
    }
    order.status = status;
    return order;
  }
}
