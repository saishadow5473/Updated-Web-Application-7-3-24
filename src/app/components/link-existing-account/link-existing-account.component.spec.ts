import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkExistingAccountComponent } from './link-existing-account.component';

describe('LinkExistingAccountComponent', () => {
  let component: LinkExistingAccountComponent;
  let fixture: ComponentFixture<LinkExistingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkExistingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkExistingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
