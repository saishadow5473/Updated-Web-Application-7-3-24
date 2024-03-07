import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeOnlineClassesComponent } from './subscribe-online-classes.component';

describe('TeleconsultDoctorListComponent', () => {
  let component: SubscribeOnlineClassesComponent;
  let fixture: ComponentFixture<SubscribeOnlineClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeOnlineClassesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeOnlineClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
