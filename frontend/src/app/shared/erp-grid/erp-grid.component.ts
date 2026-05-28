import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-erp-grid',
  standalone: true,
  imports: [AgGridAngular, FormsModule, MatIconModule],
  template: `
    <div class="grid-shell">
      <div class="grid-header">
        <div>
          <span>{{ eyebrow }}</span>
          <strong>{{ title }}</strong>
        </div>

        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            [placeholder]="searchPlaceholder"
            aria-label="Pesquisar na tabela"
          />
          <button
            type="button"
            [title]="'Modo: ' + searchModeLabel"
            [attr.aria-label]="'Modo de pesquisa: ' + searchModeLabel"
            (click)="toggleSearchMode()"
          >
            <mat-icon>{{ searchMode === 'contains' ? 'filter_alt' : 'drag_handle' }}</mat-icon>
            <span>{{ searchModeLabel }}</span>
          </button>
        </div>
      </div>

      <ag-grid-angular
        class="ag-theme-quartz"
        [rowData]="filteredRows"
        [columnDefs]="gridColumns"
        [defaultColDef]="defaultColumnDef"
        [domLayout]="'normal'"
        [pagination]="true"
        [paginationPageSize]="10"
        [suppressCellFocus]="true"
      />
    </div>
  `,
  styleUrl: './erp-grid.component.scss',
})
export class ErpGridComponent<T> {
  @Input({ required: true }) title = '';
  @Input() eyebrow = 'Tabela operacional';
  @Input() searchPlaceholder = 'Pesquisar';
  @Input() rows: T[] = [];
  @Input() columns: ColDef<T>[] = [];
  @Output() viewRow = new EventEmitter<T>();
  @Output() editRow = new EventEmitter<T>();
  @Output() deleteRow = new EventEmitter<T>();

  readonly defaultColumnDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
  };

  searchTerm = '';
  searchMode: 'contains' | 'equals' = 'contains';

  get searchModeLabel() {
    return this.searchMode === 'contains' ? 'Contém' : 'Igual';
  }

  get filteredRows(): T[] {
    const term = this.normalize(this.searchTerm);
    if (!term) {
      return this.rows;
    }

    return this.rows.filter((row) => {
      const values = this.columns.map((column) => this.getCellValue(row, column));
      return values.some((value) => {
        const normalizedValue = this.normalize(value);
        return this.searchMode === 'contains' ? normalizedValue.includes(term) : normalizedValue === term;
      });
    });
  }

  get gridColumns(): ColDef<T>[] {
    return [...this.columns, this.actionColumn];
  }

  toggleSearchMode() {
    this.searchMode = this.searchMode === 'contains' ? 'equals' : 'contains';
  }

  private getCellValue(row: T, column: ColDef<T>) {
    if (column.valueGetter && typeof column.valueGetter === 'function') {
      return column.valueGetter({ data: row } as never);
    }

    const field = column.field as keyof T | undefined;
    return field ? row[field] : '';
  }

  private normalize(value: unknown) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private readonly actionColumn: ColDef<T> = {
    headerName: 'Ações',
    width: 150,
    minWidth: 150,
    sortable: false,
    filter: false,
    resizable: false,
    pinned: 'right',
    cellRenderer: (params: { data: T }) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'grid-actions';

      const actions = [
        { icon: 'visibility', title: 'Visualizar', className: 'view', handler: () => this.viewRow.emit(params.data) },
        { icon: 'edit', title: 'Editar', className: 'edit', handler: () => this.editRow.emit(params.data) },
        { icon: 'delete', title: 'Deletar', className: 'delete', handler: () => this.deleteRow.emit(params.data) },
      ];

      actions.forEach((action) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = action.className;
        button.title = action.title;
        button.setAttribute('aria-label', action.title);
        button.innerHTML = `<span class="material-icons">${action.icon}</span>`;
        button.addEventListener('click', action.handler);
        wrapper.appendChild(button);
      });

      return wrapper;
    },
  };
}
