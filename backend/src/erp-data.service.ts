import { Injectable } from '@nestjs/common';
import { InventoryMovement, Order, Product, User } from './erp.types';

@Injectable()
export class ErpDataService {
  readonly users: User[] = [
    { id: 'USR-100', name: 'Analista ERP', email: 'admin@LERP.local', role: 'ADMIN' },
    { id: 'USR-220', name: 'Compras Zafari', email: 'buyer@LERP.local', role: 'BUYER' },
    { id: 'USR-330', name: 'Estoque CD', email: 'warehouse@LERP.local', role: 'WAREHOUSE' },
  ];

  readonly products: Product[] = [
    { id: 'MAT-1001', sku: '789100010001', name: 'Arroz Premium 5kg', category: 'Mercearia', price: 24.9, stock: 420, reorderPoint: 180, status: 'ACTIVE' },
    { id: 'MAT-1002', sku: '789100010002', name: 'Cafe Tradicional 500g', category: 'Mercearia', price: 18.7, stock: 96, reorderPoint: 120, status: 'ACTIVE' },
    { id: 'MAT-2001', sku: '789200020001', name: 'Leite Integral 1L', category: 'Laticinios', price: 5.49, stock: 740, reorderPoint: 260, status: 'ACTIVE' },
    { id: 'MAT-3001', sku: '789300030001', name: 'Detergente Neutro', category: 'Limpeza', price: 2.99, stock: 68, reorderPoint: 90, status: 'ACTIVE' },
    { id: 'MAT-4001', sku: '789400040001', name: 'Chocolate Barra 90g', category: 'Bomboniere', price: 6.99, stock: 0, reorderPoint: 60, status: 'BLOCKED' },
  ];

  readonly orders: Order[] = [
    { id: 'SO-900101', customer: 'Loja Zafari Centro', channel: 'STORE', status: 'PICKING', total: 18420.4, createdAt: '2026-05-25' },
    { id: 'SO-900102', customer: 'Cliente B2B Padaria Sul', channel: 'B2B', status: 'APPROVAL', total: 7310.9, createdAt: '2026-05-26' },
    { id: 'SO-900103', customer: 'E-commerce LERP Market', channel: 'ECOMMERCE', status: 'INVOICED', total: 2690.55, createdAt: '2026-05-27' },
  ];

  readonly movements: InventoryMovement[] = [
    { id: 'MM-50001', productSku: '789100010001', productName: 'Arroz Premium 5kg', type: 'INBOUND', quantity: 240, reference: 'PO-77120', postedAt: '2026-05-24 09:18' },
    { id: 'MM-50002', productSku: '789100010002', productName: 'Cafe Tradicional 500g', type: 'OUTBOUND', quantity: 76, reference: 'SO-900101', postedAt: '2026-05-25 11:40' },
    { id: 'MM-50003', productSku: '789300030001', productName: 'Detergente Neutro', type: 'ADJUSTMENT', quantity: -12, reference: 'COUNT-0526', postedAt: '2026-05-26 16:05' },
  ];
}
