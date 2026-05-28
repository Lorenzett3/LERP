import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Dashboard, InventoryMovement, Order, Product } from '../models/erp.models';

@Injectable({ providedIn: 'root' })
export class ErpApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  getDashboard() {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard`);
  }

  getProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(input: Pick<Product, 'sku' | 'name' | 'category' | 'price' | 'stock'>) {
    return this.http.post<Product>(`${this.apiUrl}/products`, input);
  }

  updateProduct(id: string, input: Partial<Pick<Product, 'sku' | 'name' | 'category' | 'price' | 'stock'>>) {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, input);
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`${this.apiUrl}/products/${id}`);
  }

  getOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  createOrder(input: Pick<Order, 'customer' | 'channel' | 'total'>) {
    return this.http.post<Order>(`${this.apiUrl}/orders`, input);
  }

  updateOrder(id: string, input: Partial<Pick<Order, 'customer' | 'channel' | 'status' | 'total'>>) {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, input);
  }

  deleteOrder(id: string) {
    return this.http.delete<Order>(`${this.apiUrl}/orders/${id}`);
  }

  getMovements() {
    return this.http.get<InventoryMovement[]>(`${this.apiUrl}/inventory/movements`);
  }

  postMovement(input: Pick<InventoryMovement, 'productSku' | 'type' | 'quantity' | 'reference'>) {
    return this.http.post<InventoryMovement>(`${this.apiUrl}/inventory/movements`, input);
  }

  updateMovement(id: string, input: Partial<Pick<InventoryMovement, 'productSku' | 'type' | 'quantity' | 'reference'>>) {
    return this.http.patch<InventoryMovement>(`${this.apiUrl}/inventory/movements/${id}`, input);
  }

  deleteMovement(id: string) {
    return this.http.delete<InventoryMovement>(`${this.apiUrl}/inventory/movements/${id}`);
  }
}
