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
    ).subscribe((response: any) => {
      console.log('user repos:', response);
    })
  };

}
