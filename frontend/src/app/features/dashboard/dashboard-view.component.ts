import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Dashboard } from '../../core/models/erp.models';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { WorkflowChartComponent } from '../../shared/workflow-chart/workflow-chart.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [KpiCardComponent, MatCardModule, NgClass, WorkflowChartComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss',
})
export class DashboardViewComponent {
  @Input({ required: true }) dashboard!: Dashboard;
}
