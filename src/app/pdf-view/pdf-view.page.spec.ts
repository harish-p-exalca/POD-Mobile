import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PdfViewPage } from './pdf-view.page';

describe('PdfViewPage', () => {
  let component: PdfViewPage;
  let fixture: ComponentFixture<PdfViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
