import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  status: string;
}

interface Order {
  id: string;
  customer: string;
  channel: string;
  status: string;
  total: number;
  createdAt: string;
}

interface InventoryMovement {
  id: string;
  productSku: string;
  productName: string;
  type: string;
  quantity: number;
  reference: string;
  postedAt: string;
}

interface Dashboard {
  client: string;
  companyCode: string;
  plant: string;
  kpis: Array<{ label: string; value: number; format: string; trend: string }>;
  alerts: Array<{ severity: string; title: string; detail: string }>;
  workflow: Array<{ stage: string; count: number }>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AgGridAngular,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly apiUrl = 'http://localhost:3000/api';
  activeModule = 'Dashboard';
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
    { field: 'name', headerName: 'Descricao', flex: 1 },
    { field: 'category', headerName: 'Categoria', width: 140 },
    { field: 'price', headerName: 'Preco', width: 110 },
    { field: 'stock', headerName: 'Estoque', width: 110 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  readonly orderColumns: ColDef<Order>[] = [
    { field: 'id', headerName: 'Pedido', width: 130 },
    { field: 'customer', headerName: 'Cliente', flex: 1 },
    { field: 'channel', headerName: 'Canal', width: 130 },
    { field: 'status', headerName: 'Workflow', width: 130 },
    { field: 'total', headerName: 'Valor', width: 120 },
    { field: 'createdAt', headerName: 'Criado em', width: 130 },
  ];

  readonly movementColumns: ColDef<InventoryMovement>[] = [
    { field: 'id', headerName: 'Doc. MM', width: 130 },
    { field: 'productSku', headerName: 'SKU', width: 150 },
    { field: 'productName', headerName: 'Material', flex: 1 },
    { field: 'type', headerName: 'Movimento', width: 130 },
    { field: 'quantity', headerName: 'Qtd.', width: 100 },
    { field: 'reference', headerName: 'Referencia', width: 140 },
    { field: 'postedAt', headerName: 'Lancado em', width: 160 },
  ];

  readonly defaultColumnDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  readonly productForm = this.fb.nonNullable.group({
    sku: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', Validators.required],
    category: ['Mercearia', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  readonly orderForm = this.fb.nonNullable.group({
    customer: ['', Validators.required],
    channel: ['STORE', Validators.required],
    total: [0, [Validators.required, Validators.min(1)]],
  });

  readonly movementForm = this.fb.nonNullable.group({
    productSku: ['', Validators.required],
    type: ['INBOUND', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reference: ['', Validators.required],
  });

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.http.get<Dashboard>(`${this.apiUrl}/dashboard`).subscribe((dashboard) => (this.dashboard = dashboard));
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe((products) => (this.products = products));
    this.http.get<Order[]>(`${this.apiUrl}/orders`).subscribe((orders) => (this.orders = orders));
    this.http.get<InventoryMovement[]>(`${this.apiUrl}/inventory/movements`).subscribe((movements) => (this.movements = movements));
  }

  createProduct() {
    if (this.productForm.invalid) {
      return;
    }
    this.http.post<Product>(`${this.apiUrl}/products`, this.productForm.getRawValue()).subscribe(() => {
      this.productForm.reset({ sku: '', name: '', category: 'Mercearia', price: 0, stock: 0 });
      this.refreshAll();
    });
  }

  createOrder() {
    if (this.orderForm.invalid) {
      return;
    }
    this.http.post<Order>(`${this.apiUrl}/orders`, this.orderForm.getRawValue()).subscribe(() => {
      this.orderForm.reset({ customer: '', channel: 'STORE', total: 0 });
      this.refreshAll();
    });
  }

  postMovement() {
    if (this.movementForm.invalid) {
      return;
    }
    this.http.post<InventoryMovement>(`${this.apiUrl}/inventory/movements`, this.movementForm.getRawValue()).subscribe(() => {
      this.movementForm.reset({ productSku: '', type: 'INBOUND', quantity: 1, reference: '' });
      this.refreshAll();
    });
  }

  setModule(module: string) {
    this.activeModule = module;
  }

  formatKpi(kpi: { value: number; format: string }) {
    if (kpi.format === 'currency') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpi.value);
    }
    return new Intl.NumberFormat('pt-BR').format(kpi.value);
  }
}
