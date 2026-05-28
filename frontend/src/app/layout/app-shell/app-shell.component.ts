import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Dashboard, ErpModule, NavItem } from '../../core/models/erp.models';
import { ActionButtonComponent } from '../../shared/action-button/action-button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ActionButtonComponent, MatFormFieldModule, MatIconModule, MatSelectModule],
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

  readonly navItems: NavItem[] = [
    { label: 'Painel', icon: 'dashboard' },
    { label: 'Produtos', icon: 'inventory_2' },
    { label: 'Pedidos', icon: 'receipt_long' },
    { label: 'Estoque', icon: 'sync_alt' },
  ];
}
