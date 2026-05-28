import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { InventoryMovement } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ErpGridComponent } from '../../shared/erp-grid/erp-grid.component';

@Component({
  selector: 'app-inventory-workbench',
  standalone: true,
  imports: [ActionButtonComponent, ErpGridComponent],
  templateUrl: './inventory-workbench.component.html',
  styleUrl: './workbench.component.scss',
})
export class InventoryWorkbenchComponent {
  @Input() movements: InventoryMovement[] = [];
  @Input() columns: ColDef<InventoryMovement>[] = [];
  @Output() createClicked = new EventEmitter<void>();
  @Output() viewClicked = new EventEmitter<InventoryMovement>();
  @Output() editClicked = new EventEmitter<InventoryMovement>();
  @Output() deleteClicked = new EventEmitter<InventoryMovement>();
}
