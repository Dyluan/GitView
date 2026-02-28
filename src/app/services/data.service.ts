import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getRandomFact() {
    return this.http.get('/animalsAPI/facts');
  };

  getGithubUser(username: String) {
    return this.http.get(`/githubAPI/users/${username}`);
  };

  getGithubUserRepos(url: String) {
    return this.http.get(`${url}`);
  };

  getGithubUserCommits(url: String) {
    return this.http.get(`${url}`, { params: { 'per_page': 100 }});
  };
}
