import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartialConfirmedInvoicesPage } from './partial-confirmed-invoices.page';

describe('PartialConfirmedInvoicesPage', () => {
  let component: PartialConfirmedInvoicesPage;
  let fixture: ComponentFixture<PartialConfirmedInvoicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialConfirmedInvoicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PartialConfirmedInvoicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
