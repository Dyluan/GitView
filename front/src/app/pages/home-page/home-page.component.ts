import { Component, signal, output } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ProfileInfosComponent } from '../../components/profile-infos/profile-infos.component';
import { ProfileStatsComponent } from '../../components/profile-stats/profile-stats.component';
import { ContributionsComponent } from '../../components/contributions/contributions.component';
import { ActivityComponent } from '../../components/activity/activity.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-page',
  imports: [
    SearchBarComponent, 
    ProfileInfosComponent,
    ProfileStatsComponent,
    ContributionsComponent,
    ActivityComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  constructor(private dataService: DataService) {}

  onTheFlyInput = signal<string>('');

  randomFact = signal<any>({});
  buttonClicked = output();

  profile_picture_url = signal<String>('');
  user_repos_url = signal<String>('');
  repositories = signal<[]>([]);

}
