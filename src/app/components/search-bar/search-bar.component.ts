import { Component, signal, input, model } from '@angular/core';
import { DataService } from '../../services/data.service';
import { switchMap, pipe, map, forkJoin } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  constructor(private dataService: DataService) {}

  onTheFlyInput = model<String>('');
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

  tripleSwitch() {
    this.dataService.getGithubUser(this.onTheFlyInput()).pipe(
      switchMap((gitHubUser: any) => {
        // console.log(`1. github user: ${gitHubUser}`);
        console.log('1. github user:', gitHubUser);
        this.profile_picture_url.set(gitHubUser.avatar_url);
        this.user_repos_url.set(gitHubUser.repos_url);
        
        return this.dataService.getGithubUserRepos(this.user_repos_url());
      }),
      switchMap((userRepos: any) => {
        console.log('2. user repositories:', userRepos);
        this.repositories.set(userRepos);
        const commitObservables = userRepos.map((userRepo: any) => {
          const trimmed_url = userRepo.commits_url.split('commits')[0];
          return this.dataService.getGithubUserCommits(trimmed_url);
        });

        return forkJoin(commitObservables);
      })
    ).subscribe((commit_details: any) => {
      console.log('3. commit details: ', commit_details);
    })
  }

}
