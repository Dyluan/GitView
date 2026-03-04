import { Component, signal, input, model } from '@angular/core';
import { DataService } from '../../services/data.service';
import { switchMap, pipe, map, forkJoin } from 'rxjs';
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
  randomFact = model<any>();
  profile_picture_url = model<String>('');
  user_repos_url = model<String>('');
  repositories = model<[]>([]);

  displayInputText(event: any): void {
    this.onTheFlyInput.set(event.target.value);
  };

  callServer(): void {
    this.dataService.newGitHubUser(this.onTheFlyInput()).pipe(
      switchMap((userData: any) => {
        console.log('userData:', userData);
        this.profile_picture_url.set(userData.avatar_url);
        this.user_repos_url.set(userData.repos_url);

        this.dataService.userPhoto.set(userData.avatar_url);
        this.dataService.userBio.set(userData.bio);
        this.dataService.userLocation.set(userData.location);
        this.dataService.userName.set(userData.name);
        this.dataService.userPseudo.set(userData.login);
        this.dataService.userProfileUrl.set(userData.html_url);
        this.dataService.userFollowers.set(userData.followers);
        this.dataService.userFollowing.set(userData.following);

        return this.dataService.newGithubUserRepos(this.onTheFlyInput());
      }),
      switchMap((userRepos: any) => {
        console.log('user repositories:', userRepos);
        this.repositories.set(userRepos);
        this.dataService.userRepositories.set(userRepos);

        const commitObservables = userRepos.map((repo: any) => {
          const repoName = repo.name;
          return this.dataService.newGithubUserCommits(this.onTheFlyInput(), repoName);
        });

        return forkJoin(commitObservables);
      })
    ).subscribe((userCommits: any) => {
      let number = 0;
      console.log('Past year commits: ', userCommits);
      for (let commitArray of userCommits) {
        for (let commit of commitArray) {
          let commitDate = commit.commit.author.date;
          // console.log('commited on ', commitDate);
          number += 1;
        }
        console.log('-----');
      }
      console.log(number, ' commits');
    })
  }

}
