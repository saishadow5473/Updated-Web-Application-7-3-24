import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDetailsViewComponent } from './consultation-details-view.component';

describe('ConsultationDetailsViewComponent', () => {
  let component: ConsultationDetailsViewComponent;
  let fixture: ComponentFixture<ConsultationDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
