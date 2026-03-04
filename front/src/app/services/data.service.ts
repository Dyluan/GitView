import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getGithubUser(username: String) {
    return this.http.get(`/githubAPI/users/${username}`, {
      observe: 'response'
    });
  };

  // new
  newGitHubUser(username: string) {
    return this.http.get(`http://localhost:3000/api/github/users`, { params: {username: username}});
  };

  getGithubUserRepos(url: String) {
    return this.http.get(`${url}`, {
      observe: 'response'
    });
  };

  // new
  newGithubUserRepos(username: string) {
    return this.http.get(`http://localhost:3000/api/github/repos`, { params: {username: username}});
  }

  getGithubUserCommits(url: String) {
    return this.http.get(`${url}`, { 
      params: { 'per_page': 100 },
      observe: 'response'
    });
  };

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
