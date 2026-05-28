import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Order } from '../../../core/models/erp.models';
import { EntityDialogData } from './entity-dialog.model';

type OrderInput = Pick<Order, 'customer' | 'channel' | 'total'>;

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './order-dialog.component.html',
  styleUrl: './entity-dialog.component.scss',
})
export class OrderDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<OrderDialogComponent, OrderInput>>(MatDialogRef);
  readonly data = inject<EntityDialogData<Order>>(MAT_DIALOG_DATA, { optional: true });
  readonly isViewMode = this.data?.mode === 'view';
  readonly title = this.data?.mode === 'edit' ? 'Editar pedido' : this.data?.mode === 'view' ? 'Visualizar pedido' : 'Incluir pedido';

  readonly form = this.fb.nonNullable.group({
    customer: [this.data?.item?.customer ?? '', Validators.required],
    channel: [this.data?.item?.channel ?? 'STORE', Validators.required],
    total: [this.data?.item?.total ?? 0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    if (this.isViewMode) {
      this.form.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
