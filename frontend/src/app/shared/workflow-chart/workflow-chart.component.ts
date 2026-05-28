import { Component, Input } from '@angular/core';
import { WorkflowStage } from '../../core/models/erp.models';

@Component({
  selector: 'app-workflow-chart',
  standalone: true,
  template: `
    <section class="chart">
      @for (stage of stages; track stage.stage) {
        <div class="bar-row">
          <div class="label">
            <span>{{ stage.stage }}</span>
            <strong>{{ stage.count }}</strong>
          </div>
          <div class="track">
            <span [style.width.%]="barWidth(stage.count)"></span>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './workflow-chart.component.scss',
})
export class WorkflowChartComponent {
  @Input() stages: WorkflowStage[] = [];

  barWidth(value: number) {
    const max = Math.max(...this.stages.map((stage) => stage.count), 1);
    return Math.max((value / max) * 100, value > 0 ? 14 : 0);
  }
}
