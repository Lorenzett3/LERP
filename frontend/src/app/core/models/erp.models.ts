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
  resourceType?: 'PRODUCT' | 'ORDER' | 'INVENTORY';
  resourceId?: string;
}

export interface WorkflowStage {
  stage: string;
  count: number;
}

export interface DashboardBreakdownItem {
  label: string;
  value: number;
  count?: number;
  percent?: number;
  detail?: string;
  tone?: 'success' | 'warning' | 'danger' | 'info';
  format?: 'currency' | 'number' | 'percent';
}

export interface DashboardActivityItem {
  id: string;
  label: string;
  detail: string;
  value: number;
  tone: 'success' | 'warning' | 'danger' | 'info';
}

export interface DashboardAnalytics {
  channelMix: DashboardBreakdownItem[];
  stockHealth: DashboardBreakdownItem[];
  categoryValue: DashboardBreakdownItem[];
  operations: DashboardBreakdownItem[];
  recentMovements: DashboardActivityItem[];
}

export interface Dashboard {
  client: string;
  companyCode: string;
  plant: string;
  kpis: Kpi[];
  alerts: OperationalAlert[];
  workflow: WorkflowStage[];
  analytics?: DashboardAnalytics;
}

export type GridColumn<T> = ColDef<T>;
