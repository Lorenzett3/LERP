import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BusinessEntity } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ErpGridComponent } from '../../shared/erp-grid/erp-grid.component';

@Component({
  selector: 'app-entities-workbench',
  standalone: true,
  imports: [ActionButtonComponent, ErpGridComponent],
  templateUrl: './entities-workbench.component.html',
  styleUrl: './workbench.component.scss',
})
export class EntitiesWorkbenchComponent {
  @Input() entities: BusinessEntity[] = [];
  @Input() columns: ColDef<BusinessEntity>[] = [];
  @Output() createClicked = new EventEmitter<void>();
  @Output() viewClicked = new EventEmitter<BusinessEntity>();
  @Output() editClicked = new EventEmitter<BusinessEntity>();
  @Output() deleteClicked = new EventEmitter<BusinessEntity>();
}
