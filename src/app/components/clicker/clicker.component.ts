import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-clicker',
  imports: [],
  templateUrl: './clicker.component.html',
  styleUrl: './clicker.component.css'
})
export class ClickerComponent {

  count = signal<number>(0);

  onClick() {
    this.count.update(old => old+1);
  };

}
