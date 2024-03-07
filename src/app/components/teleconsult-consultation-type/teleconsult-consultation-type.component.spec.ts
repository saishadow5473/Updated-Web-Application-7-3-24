import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultConsultationTypeComponent } from './teleconsult-consultation-type.component';

describe('TeleconsultConsultationTypeComponent', () => {
  let component: TeleconsultConsultationTypeComponent;
  let fixture: ComponentFixture<TeleconsultConsultationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultConsultationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultConsultationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
