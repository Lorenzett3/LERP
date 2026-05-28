import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ErrorDialogData {
  status: number;
  title: string;
  message: string;
  detail?: string;
}

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog">
      <div class="status-icon">
        <mat-icon>priority_high</mat-icon>
      </div>

      <div class="content">
        <span class="status">Erro {{ data.status }}</span>
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <mat-dialog-content>
          <p>{{ data.message }}</p>
          @if (data.detail) {
            <small>{{ data.detail }}</small>
          }
        </mat-dialog-content>
      </div>
    </div>

    <mat-dialog-actions align="end">
      <button mat-flat-button color="warn" type="button" (click)="close()">Entendi</button>
    </mat-dialog-actions>
  `,
  styleUrl: './error-dialog.component.scss',
})
export class ErrorDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ErrorDialogData,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
