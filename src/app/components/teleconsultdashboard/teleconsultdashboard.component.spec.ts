import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultdashboardComponent } from './teleconsultdashboard.component';

describe('TeleconsultdashboardComponent', () => {
  let component: TeleconsultdashboardComponent;
  let fixture: ComponentFixture<TeleconsultdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
