import { Component, signal, input, model } from '@angular/core';
import { DataService } from '../../services/data.service';
import { switchMap, pipe } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  constructor(private dataService: DataService) {}

  onTheFlyInput = model<String>();
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

  tripleSwitch(): void {
    this.dataService.getGithubUser(this.onTheFlyInput()!).pipe(
      switchMap((user: any) => {
        console.log('github response:', user);
        this.profile_picture_url.set(user.avatar_url);
        this.user_repos_url.set(user.repos_url);

        return this.dataService.getGithubUserRepos(this.user_repos_url());
      }), 
      switchMap((repos: any[]) => {
        console.log('user repos:', repos);
        this.repositories.set(repos);
        
        // Example: Make a third API call here
        // You need to return an Observable for the chain to work
        // For example, if you want to get details of the first repo:
        // return this.dataService.getSomeOtherData(repos[0].url);
        
        // Placeholder - replace with your actual third API call
        return this.dataService.getRandomFact();
      })
    ).subscribe((finalResult: any) => {
      console.log('final result:', finalResult);
      // Handle the result of the third API call
    })
  };

}
