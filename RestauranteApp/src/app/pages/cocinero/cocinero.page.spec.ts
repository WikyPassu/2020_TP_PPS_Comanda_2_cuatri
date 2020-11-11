import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CocineroPage } from './cocinero.page';

describe('CocineroPage', () => {
  let component: CocineroPage;
  let fixture: ComponentFixture<CocineroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocineroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CocineroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
