import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LateAndOnTimeFilterComponent } from './late-and-on-time-filter.component';

describe('LateAndOnTimeFilterComponent', () => {
  let component: LateAndOnTimeFilterComponent;
  let fixture: ComponentFixture<LateAndOnTimeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateAndOnTimeFilterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LateAndOnTimeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
