import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBotComponent } from './help-bot.component';

describe('HelpBotComponent', () => {
  let component: HelpBotComponent;
  let fixture: ComponentFixture<HelpBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
