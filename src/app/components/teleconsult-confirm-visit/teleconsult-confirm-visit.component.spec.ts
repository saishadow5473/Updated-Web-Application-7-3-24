import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultConfirmVisitComponent } from './teleconsult-confirm-visit.component';

describe('TeleconsultConfirmVisitComponent', () => {
  let component: TeleconsultConfirmVisitComponent;
  let fixture: ComponentFixture<TeleconsultConfirmVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultConfirmVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultConfirmVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
