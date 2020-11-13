import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResponderConsultaPage } from './responder-consulta.page';

describe('ResponderConsultaPage', () => {
  let component: ResponderConsultaPage;
  let fixture: ComponentFixture<ResponderConsultaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponderConsultaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponderConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
