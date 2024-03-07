import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultSpecialityComponent } from './teleconsult-speciality.component';

describe('TeleconsultSpecialityComponent', () => {
  let component: TeleconsultSpecialityComponent;
  let fixture: ComponentFixture<TeleconsultSpecialityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultSpecialityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultSpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
