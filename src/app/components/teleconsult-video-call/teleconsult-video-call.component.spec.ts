import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleconsultVideoCallComponent } from './teleconsult-video-call.component';

describe('TeleconsultSummaryComponent', () => {
  let component: TeleconsultVideoCallComponent;
  let fixture: ComponentFixture<TeleconsultVideoCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleconsultVideoCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
