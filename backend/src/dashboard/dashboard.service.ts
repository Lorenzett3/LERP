import { Injectable } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';
import { InventoryMovement, Order, Product } from '../erp.types';

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
        { label: 'Documentos MM', value: this.data.movements.length, format: 'number', trend: '+8 hoje' },
      ],
      alerts: [
        ...lowStock.map((product) => ({
          severity: product.stock === 0 ? 'ALTO' : 'MÉDIO',
          title: `${product.name} abaixo do ponto de reposição`,
          detail: `Estoque ${product.stock} / mínimo ${product.reorderPoint}`,
          resourceType: 'PRODUCT',
          resourceId: product.id,
        })),
        ...blocked.map((product) => ({
          severity: 'ALTO',
          title: `${product.name} bloqueado para venda`,
          detail: 'Revisar cadastro mestre de material',
          resourceType: 'PRODUCT',
          resourceId: product.id,
        })),
      ],
      workflow: [
        { stage: 'Pedido criado', count: this.data.orders.filter((order) => order.status === 'DRAFT').length },
        { stage: 'Aprovação', count: this.data.orders.filter((order) => order.status === 'APPROVAL').length },
        { stage: 'Separação', count: this.data.orders.filter((order) => order.status === 'PICKING').length },
        { stage: 'Faturado', count: this.data.orders.filter((order) => order.status === 'INVOICED').length },
      ],
      analytics: {
        channelMix: this.channelMix(this.data.orders, orderValue),
        stockHealth: this.stockHealth(this.data.products, lowStock.length, blocked.length),
        categoryValue: this.categoryValue(this.data.products),
        operations: this.operations(this.data.orders, this.data.products, this.data.movements),
        recentMovements: this.recentMovements(this.data.movements),
      },
    };
  }

  private channelMix(orders: Order[], totalValue: number) {
    const channelLabels: Record<Order['channel'], string> = {
      STORE: 'Loja física',
      B2B: 'B2B',
      ECOMMERCE: 'E-commerce',
    };

    return (Object.keys(channelLabels) as Order['channel'][]).map((channel) => {
      const channelOrders = orders.filter((order) => order.channel === channel);
      const value = channelOrders.reduce((sum, order) => sum + order.total, 0);

      return {
        label: channelLabels[channel],
        value,
        count: channelOrders.length,
        percent: this.percent(value, totalValue),
        format: 'currency' as const,
        detail: `${channelOrders.length} pedidos`,
      };
    });
  }

  private stockHealth(products: Product[], lowStockCount: number, blockedCount: number) {
    const normalCount = products.filter((product) => product.stock > product.reorderPoint && product.status === 'ACTIVE').length;
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const averageCoverage =
      products.reduce((sum, product) => sum + (product.reorderPoint ? product.stock / product.reorderPoint : 0), 0) /
      Math.max(products.length, 1);

    return [
      {
        label: 'Cobertura normal',
        value: normalCount,
        percent: this.percent(normalCount, products.length),
        detail: 'materiais acima do ponto',
        tone: 'success' as const,
      },
      {
        label: 'Reposição necessária',
        value: lowStockCount,
        percent: this.percent(lowStockCount, products.length),
        detail: 'materiais em atenção',
        tone: lowStockCount > 0 ? ('warning' as const) : ('success' as const),
      },
      {
        label: 'Valor em estoque',
        value: totalValue,
        detail: `${averageCoverage.toFixed(1)}x cobertura média`,
        tone: 'info' as const,
        format: 'currency' as const,
      },
      {
        label: 'Bloqueados',
        value: blockedCount,
        percent: this.percent(blockedCount, products.length),
        detail: 'cadastros indisponíveis',
        tone: blockedCount > 0 ? ('danger' as const) : ('success' as const),
      },
    ];
  }

  private categoryValue(products: Product[]) {
    const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const grouped = products.reduce<Record<string, { value: number; count: number }>>((acc, product) => {
      const current = acc[product.category] ?? { value: 0, count: 0 };
      current.value += product.price * product.stock;
      current.count += 1;
      acc[product.category] = current;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([label, data]) => ({
        label,
        value: data.value,
        count: data.count,
        percent: this.percent(data.value, totalValue),
        format: 'currency' as const,
        detail: `${data.count} materiais`,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  private operations(orders: Order[], products: Product[], movements: InventoryMovement[]) {
    const averageTicket = orders.reduce((sum, order) => sum + order.total, 0) / Math.max(orders.length, 1);
    const approvalOrders = orders.filter((order) => order.status === 'APPROVAL').length;
    const invoicedOrders = orders.filter((order) => order.status === 'INVOICED').length;
    const outboundMovements = movements.filter((movement) => movement.type === 'OUTBOUND').length;

    return [
      {
        label: 'Valor médio SD',
        value: averageTicket,
        detail: 'valor médio por pedido',
        tone: 'info' as const,
        format: 'currency' as const,
      },
      {
        label: 'Pedidos em aprovação',
        value: approvalOrders,
        percent: this.percent(approvalOrders, orders.length),
        detail: 'aguardando liberação',
        tone: approvalOrders > 0 ? ('warning' as const) : ('success' as const),
      },
      {
        label: 'Taxa faturada',
        value: invoicedOrders,
        percent: this.percent(invoicedOrders, orders.length),
        detail: 'pedidos concluídos',
        tone: 'success' as const,
      },
      {
        label: 'Saídas MM',
        value: outboundMovements,
        percent: this.percent(outboundMovements, movements.length),
        detail: 'movimentos de baixa',
        tone: 'info' as const,
      },
      {
        label: 'Materiais monitorados',
        value: products.length,
        detail: 'cadastro mestre ativo',
        tone: 'success' as const,
      },
    ];
  }

  private recentMovements(movements: InventoryMovement[]) {
    const movementLabels: Record<InventoryMovement['type'], string> = {
      INBOUND: 'Entrada',
      OUTBOUND: 'Saída',
      ADJUSTMENT: 'Ajuste',
    };

    const movementTones: Record<InventoryMovement['type'], 'success' | 'warning' | 'info'> = {
      INBOUND: 'success',
      OUTBOUND: 'info',
      ADJUSTMENT: 'warning',
    };

    return [...movements]
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
      .slice(0, 6)
      .map((movement) => ({
        id: movement.id,
        label: `${movementLabels[movement.type]} - ${movement.productName}`,
        detail: `${movement.reference} • ${movement.postedAt}`,
        value: movement.quantity,
        tone: movementTones[movement.type],
      }));
  }

  private percent(value: number, total: number) {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}
