import { Component, input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile-infos',
  imports: [],
  templateUrl: './profile-infos.component.html',
  styleUrl: './profile-infos.component.css'
})
export class ProfileInfosComponent {

  constructor(public dataService: DataService) {}

}