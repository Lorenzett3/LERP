import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Product } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';
import { ErpGridComponent } from '../../shared/erp-grid/erp-grid.component';

@Component({
  selector: 'app-products-workbench',
  standalone: true,
  imports: [ActionButtonComponent, ErpGridComponent],
  templateUrl: './products-workbench.component.html',
  styleUrl: './workbench.component.scss',
})
export class ProductsWorkbenchComponent {
  @Input() products: Product[] = [];
  @Input() columns: ColDef<Product>[] = [];
  @Output() createClicked = new EventEmitter<void>();
  @Output() viewClicked = new EventEmitter<Product>();
  @Output() editClicked = new EventEmitter<Product>();
  @Output() deleteClicked = new EventEmitter<Product>();
}
