import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
        [paginationAutoPageSize]="true"
        [suppressCellFocus]="true"
        [getRowClass]="getRowClass"
      />

      <section class="mobile-card-list" aria-label="Registros em cards">
        @for (row of filteredRows; track row; let index = $index) {
          <article class="mobile-card">
            <header>
              <span>{{ eyebrow }}</span>
              <strong>{{ getMobileTitle(row, index) }}</strong>
            </header>

            <dl>
              @for (column of visibleMobileColumns; track column.headerName || column.field) {
                <div>
                  <dt>{{ column.headerName }}</dt>
                  <dd>{{ getCellValue(row, column) }}</dd>
                </div>
              }
            </dl>

            <footer>
              <button class="view" type="button" aria-label="Visualizar" (click)="viewRow.emit(row)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button class="edit" type="button" aria-label="Editar" (click)="editRow.emit(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button class="delete" type="button" aria-label="Excluir" (click)="deleteRow.emit(row)">
                <mat-icon>delete</mat-icon>
              </button>
            </footer>
          </article>
        } @empty {
          <article class="mobile-card empty">
            <strong>Nenhum registro encontrado</strong>
          </article>
        }
      </section>
    </div>
  `,
  styleUrl: './erp-grid.component.scss',
})
export class ErpGridComponent<T> implements OnChanges {
  @Input({ required: true }) title = '';
  @Input() eyebrow = 'Tabela operacional';
  @Input() searchPlaceholder = 'Pesquisar';
  @Input() initialSearchTerm = '';
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

  readonly getRowClass = (params: { rowIndex: number }) => (params.rowIndex % 2 === 0 ? 'linha-par' : 'linha-impar');

  searchTerm = '';
  searchMode: 'contains' | 'equals' = 'contains';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialSearchTerm']) {
      this.searchTerm = this.initialSearchTerm;
      this.searchMode = 'contains';
    }
  }

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

  get visibleMobileColumns(): ColDef<T>[] {
    return this.columns.slice(0, 5);
  }

  toggleSearchMode() {
    this.searchMode = this.searchMode === 'contains' ? 'equals' : 'contains';
  }

  getCellValue(row: T, column: ColDef<T>) {
    if (column.valueGetter && typeof column.valueGetter === 'function') {
      return column.valueGetter({ data: row } as never);
    }

    const field = column.field as keyof T | undefined;
    const value = field ? row[field] : '';

    if (column.valueFormatter && typeof column.valueFormatter === 'function') {
      return column.valueFormatter({ data: row, value } as never);
    }

    return value;
  }

  getMobileTitle(row: T, index: number) {
    const titleColumn =
      this.columns.find((column) => column.field && !['id', 'sku'].includes(String(column.field))) ?? this.columns[0];
    const value = titleColumn ? this.getCellValue(row, titleColumn) : '';
    return value || `Registro ${index + 1}`;
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
        { icon: 'delete', title: 'Excluir', className: 'delete', handler: () => this.deleteRow.emit(params.data) },
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
