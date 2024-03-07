import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultFollowupComponent } from './teleconsult-followup.component';

describe('TeleconsultFollowupComponent', () => {
  let component: TeleconsultFollowupComponent;
  let fixture: ComponentFixture<TeleconsultFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
