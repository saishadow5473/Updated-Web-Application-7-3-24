import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedUsersComponent } from './affiliated-users.component';

describe('AffiliatedUsersComponent', () => {
  let component: AffiliatedUsersComponent;
  let fixture: ComponentFixture<AffiliatedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliatedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
