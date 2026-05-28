import { ColDef } from 'ag-grid-community';

export type ErpModule = 'Painel' | 'Produtos' | 'Pedidos' | 'Estoque';

export interface NavItem {
  label: ErpModule;
  icon: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  status: string;
}

export interface Order {
  id: string;
  customer: string;
  channel: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productSku: string;
  productName: string;
  type: string;
  quantity: number;
  reference: string;
  postedAt: string;
}

export interface Kpi {
  label: string;
  value: number;
  format: string;
  trend: string;
}

export interface OperationalAlert {
  severity: string;
  title: string;
  detail: string;
}

export interface WorkflowStage {
  stage: string;
  count: number;
}

export interface Dashboard {
  client: string;
  companyCode: string;
  plant: string;
  kpis: Kpi[];
  alerts: OperationalAlert[];
  workflow: WorkflowStage[];
}

export type GridColumn<T> = ColDef<T>;
