import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultSummaryComponent } from './teleconsult-summary.component';

describe('TeleconsultSummaryComponent', () => {
  let component: TeleconsultSummaryComponent;
  let fixture: ComponentFixture<TeleconsultSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
