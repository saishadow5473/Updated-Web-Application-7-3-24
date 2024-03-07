import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultMyappointmentComponent } from './teleconsult-myappointment.component';

describe('TeleconsultMyappointmentComponent', () => {
  let component: TeleconsultMyappointmentComponent;
  let fixture: ComponentFixture<TeleconsultMyappointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultMyappointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultMyappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
