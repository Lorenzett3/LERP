import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-flat-button [color]="color" [type]="type" [disabled]="disabled" (click)="pressed.emit()">
      <mat-icon>{{ icon }}</mat-icon>
      <span>{{ label }}</span>
    </button>
  `,
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  @Input({ required: true }) icon = '';
  @Input({ required: true }) label = '';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Output() pressed = new EventEmitter<void>();
}
