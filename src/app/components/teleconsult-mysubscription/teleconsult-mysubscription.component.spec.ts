import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultMySubscriptionComponent } from './teleconsult-mysubscription.component';

describe('TeleconsultMySubscriptionComponent', () => {
  let component: TeleconsultMySubscriptionComponent;
  let fixture: ComponentFixture<TeleconsultMySubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultMySubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultMySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
