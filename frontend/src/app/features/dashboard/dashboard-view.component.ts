import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Dashboard, OperationalAlert } from '../../core/models/erp.models';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { WorkflowChartComponent } from '../../shared/workflow-chart/workflow-chart.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [KpiCardComponent, MatButtonModule, MatCardModule, MatIconModule, NgClass, WorkflowChartComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent {
  @Input({ required: true }) dashboard!: Dashboard;
  @Output() alertVerify = new EventEmitter<OperationalAlert>();

  formatValue(value: number, format: string = 'number') {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    if (format === 'percent') {
      return `${value}%`;
    }

    return new Intl.NumberFormat('pt-BR').format(value);
  }

  formatQuantity(value: number) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat('pt-BR').format(value)}`;
  }
}
