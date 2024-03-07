import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenixTeleConsultationComponent } from './genix-tele-consultation.component';

describe('GenixTeleConsultationComponent', () => {
  let component: GenixTeleConsultationComponent;
  let fixture: ComponentFixture<GenixTeleConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenixTeleConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenixTeleConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
