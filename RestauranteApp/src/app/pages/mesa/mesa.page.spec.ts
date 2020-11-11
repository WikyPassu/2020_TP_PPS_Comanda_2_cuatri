import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MesaPage } from './mesa.page';

describe('MesaPage', () => {
  let component: MesaPage;
  let fixture: ComponentFixture<MesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
