import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HacerConsultaPage } from './hacer-consulta.page';

describe('HacerConsultaPage', () => {
  let component: HacerConsultaPage;
  let fixture: ComponentFixture<HacerConsultaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HacerConsultaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HacerConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
