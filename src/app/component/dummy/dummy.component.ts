import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'crm-dummy',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button color="accent" (click)="onClick()">
      {{ label }}
    </button>
  `,
  styles: [`
    button {
      margin: 10px;
      padding: 8px 16px;
      font-size: 16px;
    }
  `]
})
export class DummyComponent {
  @Input() label: string = 'Cliquer ici';
  @Output() clicked = new EventEmitter<string>();

  onClick() {
    this.clicked.emit(`Le bouton ${this.label} a été cliqué !`);
  }
}
