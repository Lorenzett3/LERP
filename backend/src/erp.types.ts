export type Role = 'ADMIN' | 'BUYER' | 'WAREHOUSE' | 'SALES';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface Order {
  id: string;
  customer: string;
  channel: 'STORE' | 'B2B' | 'ECOMMERCE';
  status: 'DRAFT' | 'APPROVAL' | 'PICKING' | 'INVOICED';
  total: number;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productSku: string;
  productName: string;
  type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT';
  quantity: number;
  reference: string;
  postedAt: string;
}
