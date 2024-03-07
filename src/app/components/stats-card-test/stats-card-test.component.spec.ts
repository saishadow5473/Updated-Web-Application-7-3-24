import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardTestComponent } from './stats-card-test.component';

describe('StatsCardTestComponent', () => {
  let component: StatsCardTestComponent;
  let fixture: ComponentFixture<StatsCardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsCardTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsCardTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
