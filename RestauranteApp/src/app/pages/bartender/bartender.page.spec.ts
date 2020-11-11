import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BartenderPage } from './bartender.page';

describe('BartenderPage', () => {
  let component: BartenderPage;
  let fixture: ComponentFixture<BartenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BartenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BartenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
