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
        temp[temp.length - 1].target === event.repo.name &&
        temp[temp.length -1].payload.action === event.payload.action
      ) {
        temp[temp.length - 1].number += 1;
        time = temp[temp.length -1].date;
      } else {
        switch (event.type) {
          case 'PushEvent':
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `Pushed a commit`,
              url: `https://github.com/${event.repo.name}`,
              payload: event.payload
            });
            break;
          case 'CreateEvent':
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `Created a repository`,
              url: `https://github.com/${event.repo.name}`,
              payload: event.payload
            });
            break;
          case 'PublicEvent':
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `Made a repository public`,
              url: `https://github.com/${event.repo.name}`,
              payload: event.payload
            });
            break;
          case 'PullRequestEvent':
            // payload : action: "merged/ opened", number: x, pull_request {url: "http:...", id: x, number: x, base: {}, head: {}}
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `${event.payload.action} a pull request`,
              url: `https://github.com/${event.repo.name}`,
              payload: event.payload
            });
            break;
          default:
            temp.push({
              rawType: event.type,
              target: event.repo.name,
              date: time,
              number: 1,
              type: `other`,
              url: `https://github.com/${event.repo.name}`,
              payload: event.payload
            });
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
