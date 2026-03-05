import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ContributionsGraphComponent } from '../contributions-graph/contributions-graph.component';

@Component({
  selector: 'app-contributions',
  imports: [
    ContributionsGraphComponent
  ],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.css'
})
export class ContributionsComponent {

  constructor(public dataService: DataService) {}

}
