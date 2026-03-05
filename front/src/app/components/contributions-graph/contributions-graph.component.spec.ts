import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionsGraphComponent } from './contributions-graph.component';

describe('ContributionsGraphComponent', () => {
  let component: ContributionsGraphComponent;
  let fixture: ComponentFixture<ContributionsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionsGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
