import { Component, computed } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contributions-graph',
  imports: [],
  templateUrl: './contributions-graph.component.html',
  styleUrl: './contributions-graph.component.css'
})
export class ContributionsGraphComponent {

  constructor(public dataService: DataService) {
    this.generatePastYearDates();
  }

  pastYearDates: string[] = [];
  weeklyDates: string[][] = []; // 2D array: weeks containing 7 days each
  
  // Computed signal that creates a Map from userCommitsDates - updates reactively
  commitCountMap = computed(() => {
    const map = new Map<string, number>();
    const commitDates = this.dataService.userCommitsDates();
    commitDates.forEach((item: any) => {
      map.set(item.date, item.value);
    });
    return map;
  });

  getCommitCountForDate(date: string): number {
    return this.commitCountMap().get(date) || 0;
  }

  getCommitLevel(count: number): string {
    if (count === 0) return 'level-0';
    if (count <= 3) return 'level-1';
    if (count <= 6) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  }

  generatePastYearDates(): void {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const dates: string[] = [];
    const currentDate = new Date(oneYearAgo);

    while (currentDate <= today) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.pastYearDates = dates;
    
    // Chunk into weeks (groups of 7 days)
    this.weeklyDates = [];
    for (let i = 0; i < dates.length; i += 7) {
      this.weeklyDates.push(dates.slice(i, i + 7));
    }
    
    console.log(this.weeklyDates);
  }
}
