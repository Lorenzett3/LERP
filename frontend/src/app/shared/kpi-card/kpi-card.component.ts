import { Component, Input } from '@angular/core';
import { Kpi } from '../../core/models/erp.models';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <article>
      <span>{{ kpi.label }}</span>
      <strong>{{ formattedValue }}</strong>
      <small>{{ kpi.trend }}</small>
    </article>
  `,
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: Kpi;

  get formattedValue() {
    if (this.kpi.format === 'currency') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.kpi.value);
    }
    return new Intl.NumberFormat('pt-BR').format(this.kpi.value);
  }
}
