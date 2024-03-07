import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricesComponent } from './metrices.component';

describe('MetricesComponent', () => {
  let component: MetricesComponent;
  let fixture: ComponentFixture<MetricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
