import { DashboardService } from './dashboard.service';
import { ErpDataService } from '../erp-data.service';

describe('DashboardService', () => {
  it('builds the ERP overview from seeded operational data', () => {
    const service = new DashboardService(new ErpDataService());

    const overview = service.overview();

    expect(overview.client).toBe('800');
    expect(overview.kpis).toHaveLength(4);
    expect(overview.alerts.length).toBeGreaterThan(0);
    expect(overview.workflow.map((stage) => stage.stage)).toEqual([
      'Pedido criado',
      'Aprovacao',
      'Separacao',
      'Faturado',
    ]);
  });
});
