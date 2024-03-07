import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultDoctorListComponent } from './teleconsult-doctor-list.component';

describe('TeleconsultDoctorListComponent', () => {
  let component: TeleconsultDoctorListComponent;
  let fixture: ComponentFixture<TeleconsultDoctorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultDoctorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
