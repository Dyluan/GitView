import { Component, computed } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
})
export class ActivityComponent {
  constructor(public dataService: DataService) {}

  computedEvents = computed(() => {
    let temp = [];
    for (let event of this.dataService.userEvents()) {
      let time = Math.floor(
        (Date.now() - new Date(event.created_at).getTime()) / (1000 * 60 * 60),
      );

      // if the user has multiple events of the same type on the same repo
      if (
        temp.length > 0 &&
        temp[temp.length - 1].rawType === event.type &&
        temp[temp.length - 1].target === event.repo.name
      ) {
        temp[temp.length - 1].number += 1;
        time = temp[temp.length -1].date;
        console.log('same event, same repo:', event);
      } else {
        switch (event.type) {
          case 'PushEvent':
            console.log('new push, different repo:', event);
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `Pushed a commit`,
            });
            break;
          case 'CreateEvent':
            console.log('new create, different repo:', event);
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `Created a repository`,
            });
            break;
          default:
            break;
        }
      }
    }
    return temp;
  });

  // I'll probably rewrite this function but this works for now
  timeConverter(realTime: number): string {
    if (realTime < 24) {
      return `${realTime} hours ago`;
    } else if (realTime >= 24 && realTime < 48) {
      return "Yesterday";
    } else if (realTime >= 48 && realTime < 72) {
      return "2 days ago";
    } else if (realTime >= 72 && realTime < 96) {
      return "3 days ago";
    } else if (realTime >= 96 && realTime < 120) {
      return "4 days ago";
    } else if (realTime >= 120 && realTime < 144) {
      return "5 days ago";
    } else if (realTime >= 144 && realTime < 168) {
      return "6 days ago";
    } else if (realTime >= 168 && realTime < 336) {
      return "Last week";
    } else if (realTime >= 336 && realTime < 504) {
      return "2 weeks ago";
    } else if (realTime >= 504 && realTime < 672) {
      return "3 weeks ago";
    } else if (realTime >= 672 && realTime < 744) {
      return "A month ago";
    } else {
      return `${Math.floor((realTime / 744))} months ago`;
    }
  }

}
