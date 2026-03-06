import { Component, signal, input, model } from '@angular/core';
import { DataService } from '../../services/data.service';
import { switchMap, mergeMap, pipe, map, forkJoin, catchError, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-bar',
  imports: [
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  constructor(private dataService: DataService) {}

  onTheFlyInput = model<string>('');

  displayInputText(event: any): void {
    this.onTheFlyInput.set(event.target.value);
  };

  callServer(): void {
    this.dataService.newGitHubUser(this.onTheFlyInput()).pipe(
      switchMap((userData: any) => {
        console.log('userData:', userData);

        this.dataService.userPhoto.set(userData.avatar_url);
        this.dataService.userBio.set(userData.bio);
        this.dataService.userLocation.set(userData.location);
        this.dataService.userName.set(userData.name);
        this.dataService.userPseudo.set(userData.login);
        this.dataService.userProfileUrl.set(userData.html_url);
        this.dataService.userFollowers.set(userData.followers);
        this.dataService.userFollowing.set(userData.following);
        this.dataService.userPublicRepos.set(userData.public_repos);

        // the user profile is loaded
        this.dataService.isProfileDataLoaded.set(true);
        // the user stats are loaded as well
        this.dataService.isProfileStatsLoaded.set(true);

        return forkJoin({
          userRepos: this.dataService.newGithubUserRepos(this.onTheFlyInput()),
          userEvents: this.dataService.getGithubUserEvents(this.onTheFlyInput())
        });
      }),
      mergeMap((result: any) => {
        const { userRepos, userEvents } = result;
        console.log('user repositories:', userRepos);
        console.log('recent events:', userEvents);
        this.dataService.userRepositories.set(userRepos);
        this.dataService.userEvents.set(userEvents.slice(0, 5));

        const commitObservables = userRepos.map((repo: any) => {
          const repoName = repo.name;
          return this.dataService.newGithubUserCommits(this.onTheFlyInput(), repoName).pipe(
            // catchError takes care of wrong requests, ie: when the repository is empty => there's no commit to fetch
            catchError(error => {
              return of([]);
            })
          );
        });

        return forkJoin(commitObservables);
      })
    ).subscribe((userCommits: any) => {
      let number = 0;
      let dateCountMap = new Map<string, number>();

      console.log('Past year commits: ', userCommits);
      for (let commitArray of userCommits) {
        for (let commit of commitArray) {
          // commit.author.date = 2026-01-26T15:13:47Z
          let commitDate = commit.commit.author.date.split('T')[0];

          const currentCount = dateCountMap.get(commitDate) || 0;
          dateCountMap.set(commitDate, currentCount + 1);
          number += 1;
        }
        console.log('-----');
      }
      console.log(number, ' commits');
      this.dataService.userTotalCommits.set(number);

      let tempDatesObject = Array.from(dateCountMap, ([date, value]) => ({
        date,
        value
      }));

      console.log(tempDatesObject);
      this.dataService.userCommitsDates.set(tempDatesObject);
    })
  }

}
