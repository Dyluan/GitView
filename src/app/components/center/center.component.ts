import { Component, input } from '@angular/core';

@Component({
  selector: 'app-center',
  imports: [],
  templateUrl: './center.component.html',
  styleUrl: './center.component.css'
})
export class CenterComponent {

  randomFact = input<any>();
  profile_picture_url = input<String>('');

  isEmpty(obj: Object) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  };

}
