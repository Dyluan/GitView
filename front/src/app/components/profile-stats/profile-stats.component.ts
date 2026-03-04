import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile-stats',
  imports: [],
  templateUrl: './profile-stats.component.html',
  styleUrl: './profile-stats.component.css'
})
export class ProfileStatsComponent {

  constructor(public dataService: DataService) {}

  

}
