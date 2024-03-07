import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointAccountCreationComponent } from './joint-account-creation.component';

describe('JointAccountCreationComponent', () => {
  let component: JointAccountCreationComponent;
  let fixture: ComponentFixture<JointAccountCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointAccountCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
