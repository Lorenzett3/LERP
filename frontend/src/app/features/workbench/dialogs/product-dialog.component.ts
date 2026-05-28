import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../../core/models/erp.models';
import { EntityDialogData } from './entity-dialog.model';

type ProductInput = Pick<Product, 'sku' | 'name' | 'category' | 'price' | 'stock'>;

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './entity-dialog.component.scss',
})
export class ProductDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<ProductDialogComponent, ProductInput>>(MatDialogRef);
  readonly data = inject<EntityDialogData<Product>>(MAT_DIALOG_DATA, { optional: true });
  readonly isViewMode = this.data?.mode === 'view';
  readonly title = this.data?.mode === 'edit' ? 'Editar material' : this.data?.mode === 'view' ? 'Visualizar material' : 'Incluir material';

  readonly form = this.fb.nonNullable.group({
    sku: [this.data?.item?.sku ?? '', [Validators.required, Validators.minLength(6)]],
    name: [this.data?.item?.name ?? '', Validators.required],
    category: [this.data?.item?.category ?? 'Mercearia', Validators.required],
    price: [this.data?.item?.price ?? 0, [Validators.required, Validators.min(0.01)]],
    stock: [this.data?.item?.stock ?? 0, [Validators.required, Validators.min(0)]],
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
