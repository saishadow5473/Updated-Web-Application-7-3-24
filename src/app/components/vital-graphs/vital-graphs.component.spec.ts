import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalGraphsComponent } from './vital-graphs.component';

describe('VitalGraphsComponent', () => {
  let component: VitalGraphsComponent;
  let fixture: ComponentFixture<VitalGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
