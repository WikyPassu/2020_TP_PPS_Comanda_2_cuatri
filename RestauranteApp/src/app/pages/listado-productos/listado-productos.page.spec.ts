import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoProductosPage } from './listado-productos.page';

describe('ListadoProductosPage', () => {
  let component: ListadoProductosPage;
  let fixture: ComponentFixture<ListadoProductosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoProductosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
