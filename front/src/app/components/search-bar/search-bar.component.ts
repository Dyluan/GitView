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

  // TODO, add a 2nd switchMap call to chain a 3rd request.
  new(): void {
    this.dataService.getGithubUser(this.onTheFlyInput()!).pipe(
      switchMap((response: any) => {
        console.log('github response:', response);
        this.profile_picture_url.set(response.avatar_url);
        this.user_repos_url.set(response.repos_url);

        return this.dataService.getGithubUserRepos(this.user_repos_url());
      })
    ).subscribe((repositories: any) => {
      console.log('user repos:', repositories);
      this.repositories.set(repositories);
    })
  };

  callServer(): void {
    this.dataService.newGitHubUser(this.onTheFlyInput()).pipe(
      switchMap((userData: any) => {
        console.log('userData:', userData);
        this.profile_picture_url.set(userData.avatar_url);
        this.user_repos_url.set(userData.repos_url);

        return this.dataService.newGithubUserRepos(this.onTheFlyInput());
      }),
      switchMap((userRepos: any) => {
        console.log('user repositories:', userRepos);
        this.repositories.set(userRepos);

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

  tripleSwitch() {
    this.dataService.getGithubUser(this.onTheFlyInput()).pipe(
      switchMap((userResponse: HttpResponse<any>) => {
        const gitHubUser = userResponse.body;
        console.log('1. github user:', gitHubUser);
        this.profile_picture_url.set(gitHubUser.avatar_url);
        this.user_repos_url.set(gitHubUser.repos_url);
        
        return this.dataService.getGithubUserRepos(this.user_repos_url());
      }),
      switchMap((userRepos: HttpResponse<any>) => {
        const repos = userRepos.body;
        console.log('2. user repositories:', repos);
        console.log('2. My headers:', userRepos.headers);
        this.repositories.set(repos);
        const commitObservables = repos.map((repo: any) => {
          // commits_url: "https://api.github.com/repos/Dyluan/Dyluan/commits{/sha}"
          const trimmed_url = repo.commits_url.split('{')[0];
          return this.dataService.getGithubUserCommits(trimmed_url);
        });

        return forkJoin(commitObservables);
      })
    ).subscribe((commit_details: any) => {
      console.log('3. commit details: ', commit_details);
    })
  }

}
