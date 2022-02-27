import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnTimeAndLateInvsPage } from './on-time-and-late-invs.page';

describe('OnTimeAndLateInvsPage', () => {
  let component: OnTimeAndLateInvsPage;
  let fixture: ComponentFixture<OnTimeAndLateInvsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnTimeAndLateInvsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnTimeAndLateInvsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
