import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Dashboard, ErpModule, NavItem } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ActionButtonComponent, MatIconModule, MatMenuModule],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  @Input({ required: true }) activeModule!: ErpModule;
  @Input({ required: true }) dashboard!: Dashboard;
  @Input() selectedUser = '';

  @Output() moduleChanged = new EventEmitter<ErpModule>();
  @Output() selectedUserChange = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();

  readonly demoUsers = [
    { value: 'admin@LERP.local', code: 'ADM', role: 'Analista ERP', label: 'Administrador - Analista ERP' },
    { value: 'buyer@LERP.local', code: 'COMPRAS', role: 'Compras', label: 'Compras - Reposição' },
    { value: 'warehouse@LERP.local', code: 'ESTOQUE', role: 'Estoque', label: 'Estoque - Separação' },
  ];

  readonly navItems: NavItem[] = [
    { label: 'Painel', icon: 'dashboard' },
    { label: 'Produtos', icon: 'inventory_2' },
    { label: 'Pedidos', icon: 'receipt_long' },
    { label: 'Estoque', icon: 'sync_alt' },
  ];

  get selectedUserData() {
    return this.demoUsers.find((user) => user.value === this.selectedUser) ?? this.demoUsers[0];
  }

  get selectedUserCode(): string {
    return this.selectedUserData.code;
  }

  get selectedUserRole(): string {
    return this.selectedUserData.role;
  }

  get selectedUserLabel(): string {
    return this.selectedUserData.label;
  }
}
