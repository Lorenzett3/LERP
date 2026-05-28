import { Injectable, NotFoundException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class ProductsService {
  constructor(private readonly data: ErpDataService) {}

  findAll() {
    return this.data.products;
  }

  lowStock() {
    return this.data.products.filter((product) => product.stock <= product.reorderPoint);
  }

  create(input: { sku: string; name: string; category: string; price: number; stock: number }) {
    const product = {
      id: `MAT-${Math.floor(Math.random() * 9000 + 1000)}`,
      reorderPoint: 50,
      status: 'ACTIVE' as const,
      ...input,
    };
    this.data.products.unshift(product);
    return product;
  }

  updateStock(id: string, stock: number) {
    const product = this.data.products.find((item) => item.id === id);
    if (!product) {
      throw new NotFoundException('Material nao encontrado.');
    }
    product.stock = stock;
    return product;
  }
}
