import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColDef } from 'ag-grid-community';
import { Dashboard, ErpModule, InventoryMovement, Order, Product } from './core/models/erp.models';
import { ErpApiService } from './core/services/erp-api.service';
import { DashboardViewComponent } from './features/dashboard/dashboard-view.component';
import { InventoryWorkbenchComponent } from './features/workbench/inventory-workbench.component';
import { OrdersWorkbenchComponent } from './features/workbench/orders-workbench.component';
import { ProductsWorkbenchComponent } from './features/workbench/products-workbench.component';
import { InventoryDialogComponent } from './features/workbench/dialogs/inventory-dialog.component';
import { EntityDialogMode } from './features/workbench/dialogs/entity-dialog.model';
import { OrderDialogComponent } from './features/workbench/dialogs/order-dialog.component';
import { ProductDialogComponent } from './features/workbench/dialogs/product-dialog.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppShellComponent,
    DashboardViewComponent,
    InventoryWorkbenchComponent,
    OrdersWorkbenchComponent,
    ProductsWorkbenchComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly api = inject(ErpApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  activeModule: ErpModule = 'Painel';
  selectedUser = 'admin@LERP.local';

  dashboard: Dashboard = {
    client: '800',
    companyCode: 'BR10',
    plant: 'CD-RS01',
    kpis: [],
    alerts: [],
    workflow: [],
  };

  products: Product[] = [];
  orders: Order[] = [];
  movements: InventoryMovement[] = [];

  readonly productColumns: ColDef<Product>[] = [
    { field: 'id', headerName: 'Material', width: 120 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'name', headerName: 'Descrição', flex: 1 },
    { field: 'category', headerName: 'Categoria', width: 140 },
    { field: 'price', headerName: 'Preço', width: 110 },
    { field: 'stock', headerName: 'Estoque', width: 110 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  readonly orderColumns: ColDef<Order>[] = [
    { field: 'id', headerName: 'Pedido', width: 130 },
    { field: 'customer', headerName: 'Cliente', flex: 1 },
    { field: 'channel', headerName: 'Canal', width: 130 },
    { field: 'status', headerName: 'Fluxo', width: 130 },
    { field: 'total', headerName: 'Valor', width: 120 },
    { field: 'createdAt', headerName: 'Criado em', width: 130 },
  ];

  readonly movementColumns: ColDef<InventoryMovement>[] = [
    { field: 'id', headerName: 'Doc. MM', width: 130 },
    { field: 'productSku', headerName: 'SKU', width: 150 },
    { field: 'productName', headerName: 'Material', flex: 1 },
    { field: 'type', headerName: 'Movimento', width: 130 },
    { field: 'quantity', headerName: 'Qtd.', width: 100 },
    { field: 'reference', headerName: 'Referência', width: 140 },
    { field: 'postedAt', headerName: 'Lançado em', width: 160 },
  ];

  readonly defaultColumnDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.api.getDashboard().subscribe((dashboard) => (this.dashboard = dashboard));
    this.api.getProducts().subscribe((products) => (this.products = products));
    this.api.getOrders().subscribe((orders) => (this.orders = orders));
    this.api.getMovements().subscribe((movements) => (this.movements = movements));
  }

  openProductDialog(mode: EntityDialogMode = 'create', item?: Product) {
    this.dialog
      .open(ProductDialogComponent, {
        autoFocus: 'first-tabbable',
        data: { mode, item },
        panelClass: 'entity-dialog-panel',
        restoreFocus: true,
      })
      .afterClosed()
      .subscribe((input) => {
        if (input && mode === 'create') {
          this.createProduct(input);
        }
        if (input && mode === 'edit' && item) {
          this.updateProduct(item.id, input);
        }
      });
  }

  openOrderDialog(mode: EntityDialogMode = 'create', item?: Order) {
    this.dialog
      .open(OrderDialogComponent, {
        autoFocus: 'first-tabbable',
        data: { mode, item },
        panelClass: 'entity-dialog-panel',
        restoreFocus: true,
      })
      .afterClosed()
      .subscribe((input) => {
        if (input && mode === 'create') {
          this.createOrder(input);
        }
        if (input && mode === 'edit' && item) {
          this.updateOrder(item.id, input);
        }
      });
  }

  openInventoryDialog(mode: EntityDialogMode = 'create', item?: InventoryMovement) {
    this.dialog
      .open(InventoryDialogComponent, {
        autoFocus: 'first-tabbable',
        data: { mode, item },
        panelClass: 'entity-dialog-panel',
        restoreFocus: true,
      })
      .afterClosed()
      .subscribe((input) => {
        if (input && mode === 'create') {
          this.postMovement(input);
        }
        if (input && mode === 'edit' && item) {
          this.updateMovement(item.id, input);
        }
      });
  }

  private createProduct(input: Pick<Product, 'sku' | 'name' | 'category' | 'price' | 'stock'>) {
    this.api.createProduct(input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Produto criado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel criar o produto.'),
    });
  }

  private updateProduct(id: string, input: Pick<Product, 'sku' | 'name' | 'category' | 'price' | 'stock'>) {
    this.api.updateProduct(id, input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Produto alterado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel alterar o produto.'),
    });
  }

  deleteProduct(product: Product) {
    this.api.deleteProduct(product.id).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Produto deletado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel deletar o produto.'),
    });
  }

  private createOrder(input: Pick<Order, 'customer' | 'channel' | 'total'>) {
    this.api.createOrder(input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Pedido criado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel criar o pedido.'),
    });
  }

  private updateOrder(id: string, input: Pick<Order, 'customer' | 'channel' | 'total'>) {
    this.api.updateOrder(id, input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Pedido alterado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel alterar o pedido.'),
    });
  }

  deleteOrder(order: Order) {
    this.api.deleteOrder(order.id).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Pedido deletado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel deletar o pedido.'),
    });
  }

  private postMovement(input: Pick<InventoryMovement, 'productSku' | 'type' | 'quantity' | 'reference'>) {
    this.api.postMovement(input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Movimento de estoque lançado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel lancar o movimento de estoque.'),
    });
  }

  private updateMovement(id: string, input: Pick<InventoryMovement, 'productSku' | 'type' | 'quantity' | 'reference'>) {
    this.api.updateMovement(id, input).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Movimento de estoque alterado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel alterar o movimento de estoque.'),
    });
  }

  deleteMovement(movement: InventoryMovement) {
    this.api.deleteMovement(movement.id).subscribe({
      next: () => {
        this.refreshAll();
        this.openSuccessSnackBar('Movimento de estoque deletado com sucesso.');
      },
      error: (error: HttpErrorResponse) => this.openErrorSnackBar(error, 'Nao foi possivel deletar o movimento de estoque.'),
    });
  }

  setModule(module: ErpModule) {
    this.activeModule = module;
  }

  private openSuccessSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
  }

  private openErrorSnackBar(error: HttpErrorResponse, fallbackMessage: string) {
    const status = error.status || 500;
    const message = this.extractErrorMessage(error) || fallbackMessage;

    this.snackBar.open(`Erro ${status}: ${message}`, 'OK', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }

  private extractErrorMessage(error: HttpErrorResponse) {
    if (typeof error.error === 'string') {
      return error.error;
    }

    if (Array.isArray(error.error?.message)) {
      return error.error.message.join(' ');
    }

    return error.error?.message;
  }
}
