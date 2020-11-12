import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JuegosPage } from './juegos.page';

describe('JuegosPage', () => {
  let component: JuegosPage;
  let fixture: ComponentFixture<JuegosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JuegosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
