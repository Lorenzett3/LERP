import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Order } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ErpGridComponent } from '../../shared/erp-grid/erp-grid.component';

@Component({
  selector: 'app-orders-workbench',
  standalone: true,
  imports: [ActionButtonComponent, ErpGridComponent],
  templateUrl: './orders-workbench.component.html',
  styleUrl: './workbench.component.scss',
})
export class OrdersWorkbenchComponent {
  @Input() orders: Order[] = [];
  @Input() columns: ColDef<Order>[] = [];
  @Output() createClicked = new EventEmitter<void>();
  @Output() viewClicked = new EventEmitter<Order>();
  @Output() editClicked = new EventEmitter<Order>();
  @Output() deleteClicked = new EventEmitter<Order>();
}
