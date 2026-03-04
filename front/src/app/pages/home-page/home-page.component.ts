import { Component, signal, output } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CenterComponent } from '../../components/center/center.component';
import { ProfileInfosComponent } from '../../components/profile-infos/profile-infos.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-page',
  imports: [
    SearchBarComponent, 
    CenterComponent, 
    ProfileInfosComponent
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
