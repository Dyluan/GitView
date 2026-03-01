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

  getGithubUserRepos(url: String) {
    return this.http.get(`${url}`, {
      observe: 'response'
    });
  };

  getGithubUserCommits(url: String) {
    return this.http.get(`${url}`, { 
      params: { 'per_page': 100 },
      observe: 'response'
    });
  };
}
