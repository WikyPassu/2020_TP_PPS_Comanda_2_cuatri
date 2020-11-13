import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstadisticasEmpleadosPage } from './estadisticas-empleados.page';

describe('EstadisticasEmpleadosPage', () => {
  let component: EstadisticasEmpleadosPage;
  let fixture: ComponentFixture<EstadisticasEmpleadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticasEmpleadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasEmpleadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
