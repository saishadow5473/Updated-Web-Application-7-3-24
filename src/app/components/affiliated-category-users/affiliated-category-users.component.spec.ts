import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedCategoryUsersComponent } from './affiliated-category-users.component';

describe('AffiliatedCategoryUsersComponent', () => {
  let component: AffiliatedCategoryUsersComponent;
  let fixture: ComponentFixture<AffiliatedCategoryUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffiliatedCategoryUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatedCategoryUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
