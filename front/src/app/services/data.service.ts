import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  userPhoto = signal<string>('');
  userName = signal<string>('');
  userPseudo = signal<string>('');
  userBio = signal<string>('');
  userLocation = signal<string>('');
  userLink = signal<string>('');
  userRepositories = signal<any[]>([]);
  userProfileUrl = signal<string>('');
  userFollowers = signal<number>(0);
  userFollowing = signal<number>(0);
  userTotalCommits = signal<number>(0);

  // new
  newGitHubUser(username: string) {
    return this.http.get(`http://localhost:3000/api/github/users`, { params: {username: username}});
  };

  // new
  newGithubUserRepos(username: string) {
    return this.http.get(`http://localhost:3000/api/github/repos`, { params: {username: username}});
  }

  // new
  newGithubUserCommits(username: string, reponame: string) {
    return this.http.get(`http://localhost:3000/api/github/commits`, 
      { params: { 
        username: username,
        repo: reponame
      } }
    )
  }
}
