import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BusinessEntity } from '../../../core/models/erp.models';
import { EntityDialogData } from './entity-dialog.model';

type BusinessEntityInput = Omit<BusinessEntity, 'id'>;

@Component({
  selector: 'app-entity-record-dialog',
  standalone: true,
  imports: [MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './entity-record-dialog.component.html',
  styleUrl: './entity-dialog.component.scss',
})
export class EntityRecordDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<EntityRecordDialogComponent, BusinessEntityInput>>(MatDialogRef);
  readonly data = inject<EntityDialogData<BusinessEntity>>(MAT_DIALOG_DATA, { optional: true });
  readonly isViewMode = this.data?.mode === 'view';
  readonly title = this.data?.mode === 'edit' ? 'Editar entidade' : this.data?.mode === 'view' ? 'Visualizar entidade' : 'Incluir entidade';

  readonly form = this.fb.nonNullable.group({
    kind: [this.data?.item?.kind ?? 'CUSTOMER', Validators.required],
    name: [this.data?.item?.name ?? '', Validators.required],
    document: [this.data?.item?.document ?? '', Validators.required],
    customerType: [this.data?.item?.customerType ?? 'PJ'],
    segment: [this.data?.item?.segment ?? 'RETAIL'],
    role: [this.data?.item?.role ?? 'SALES'],
    email: [this.data?.item?.email ?? ''],
    creditLimit: [this.data?.item?.creditLimit ?? 0, Validators.min(0)],
    active: [this.data?.item?.status !== 'INACTIVE'],
  });

  get isCustomer() {
    return this.form.controls.kind.value === 'CUSTOMER';
  }

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

    const { active, ...value } = this.form.getRawValue();
    this.dialogRef.close({
      ...value,
      status: active ? 'ACTIVE' : 'INACTIVE',
    });
  }
}
