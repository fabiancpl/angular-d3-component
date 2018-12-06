import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaobaMultipleAreaChartComponent } from './caoba-multiple-area-chart.component';

describe('CaobaMultipleAreaChartComponent', () => {
  let component: CaobaMultipleAreaChartComponent;
  let fixture: ComponentFixture<CaobaMultipleAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaobaMultipleAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaobaMultipleAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
