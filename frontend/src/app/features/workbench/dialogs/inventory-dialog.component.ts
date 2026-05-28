import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InventoryMovement } from '../../../core/models/erp.models';
import { EntityDialogData } from './entity-dialog.model';

type MovementInput = Pick<InventoryMovement, 'productSku' | 'type' | 'quantity' | 'reference'>;

@Component({
  selector: 'app-inventory-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './inventory-dialog.component.html',
  styleUrl: './entity-dialog.component.scss',
})
export class InventoryDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<InventoryDialogComponent, MovementInput>>(MatDialogRef);
  readonly data = inject<EntityDialogData<InventoryMovement>>(MAT_DIALOG_DATA, { optional: true });
  readonly isViewMode = this.data?.mode === 'view';
  readonly title = this.data?.mode === 'edit' ? 'Editar movimento' : this.data?.mode === 'view' ? 'Visualizar movimento' : 'Incluir movimento';

  readonly form = this.fb.nonNullable.group({
    productSku: [this.data?.item?.productSku ?? '', Validators.required],
    productName: [{ value: this.data?.item?.productName ?? '', disabled: true }],
    type: [this.data?.item?.type ?? 'INBOUND', Validators.required],
    quantity: [this.data?.item?.quantity ?? 1, [Validators.required, Validators.min(1)]],
    reference: [this.data?.item?.reference ?? '', Validators.required],
    postedAt: [{ value: this.data?.item?.postedAt ?? '', disabled: true }],
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

    const { productName, postedAt, ...value } = this.form.getRawValue();
    this.dialogRef.close(value);
  }
}
