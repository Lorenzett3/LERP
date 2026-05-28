import { Injectable } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';

@Injectable()
export class DashboardService {
  constructor(private readonly data: ErpDataService) {}

  overview() {
    const orderValue = this.data.orders.reduce((sum, order) => sum + order.total, 0);
    const lowStock = this.data.products.filter((product) => product.stock <= product.reorderPoint);
    const blocked = this.data.products.filter((product) => product.status === 'BLOCKED');

    return {
      client: '800',
      companyCode: 'BR10',
      plant: 'CD-RS01',
      kpis: [
        { label: 'Valor em pedidos', value: orderValue, format: 'currency', trend: '+12.4%' },
        { label: 'Materiais ativos', value: this.data.products.length, format: 'number', trend: '+3' },
        { label: 'Alertas de estoque', value: lowStock.length, format: 'number', trend: 'critico' },
        { label: 'Documentos MM', value: this.data.movements.length, format: 'number', trend: '+8 hoje' },
      ],
      alerts: [
        ...lowStock.map((product) => ({
          severity: product.stock === 0 ? 'HIGH' : 'MEDIUM',
          title: `${product.name} abaixo do ponto de reposicao`,
          detail: `Estoque ${product.stock} / minimo ${product.reorderPoint}`,
        })),
        ...blocked.map((product) => ({
          severity: 'HIGH',
          title: `${product.name} bloqueado para venda`,
          detail: 'Revisar cadastro mestre de material',
        })),
      ],
      workflow: [
        { stage: 'Pedido criado', count: this.data.orders.filter((order) => order.status === 'DRAFT').length },
        { stage: 'Aprovacao', count: this.data.orders.filter((order) => order.status === 'APPROVAL').length },
        { stage: 'Separacao', count: this.data.orders.filter((order) => order.status === 'PICKING').length },
        { stage: 'Faturado', count: this.data.orders.filter((order) => order.status === 'INVOICED').length },
      ],
    };
  }
}
