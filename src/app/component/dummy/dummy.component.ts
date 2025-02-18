import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "crm-dummy",
  standalone: true,
  template: `
    <p>
      <span>{{label}}</span>
      <button (click)="onClicked($event)">Click Me</button>
    </p>
  `,
  styles: [`
    span {
      color: green;
    }
  `]
})
export class DummyComponent {
  @Input()
  public label = "";

  @Output()
  public clicked = new EventEmitter<string>();

  constructor() {}

  onClicked($event: any): void {
    this.clicked.emit(this.label + "a random string");
  }
}
