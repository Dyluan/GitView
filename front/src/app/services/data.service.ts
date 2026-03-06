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
  userPublicRepos = signal<number>(0);
  userTotalCommits = signal<number>(0);
  userEvents = signal<Object[]>([]);

  userCommitsDates = signal<Object[]>([]);

  isProfileDataLoaded = signal<boolean>(false);
  isProfileStatsLoaded = signal<boolean>(false);
  isProfileContribsLoaded = signal<boolean>(false);
  isProfileActivityLoaded = signal<boolean>(false);

  newGitHubUser(username: string) {
    return this.http.get(`http://localhost:3000/api/github/users`, { params: {username: username}});
  };

  newGithubUserRepos(username: string) {
    return this.http.get(`http://localhost:3000/api/github/repos`, { params: {username: username}});
  }

  newGithubUserCommits(username: string, reponame: string) {
    return this.http.get(`http://localhost:3000/api/github/commits`, 
      { params: { 
        username: username,
        repo: reponame
      } }
    )
  }

  getGithubUserEvents(username: string) {
    return this.http.get(`http://localhost:3000/api/github/events`, { params: {username: username} });
  }
}
