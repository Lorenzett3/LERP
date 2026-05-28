import { Component, Input } from '@angular/core';
import { WorkflowStage } from '../../core/models/erp.models';

@Component({
  selector: 'app-workflow-chart',
  standalone: true,
  template: `
    <section class="chart">
      @for (stage of stages; track stage.stage) {
        <article class="stage-card" [style.--stage-progress]="barWidth(stage.count) + '%'">
          <div class="stage-copy">
            <span>{{ stage.stage }}</span>
            <strong>{{ stage.count }}</strong>
            <small>documentos</small>
          </div>

          <div class="stage-meter" aria-hidden="true">
            <span></span>
          </div>
        </article>
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
