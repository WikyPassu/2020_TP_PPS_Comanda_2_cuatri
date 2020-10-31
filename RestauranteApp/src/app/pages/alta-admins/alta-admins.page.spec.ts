import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaAdminsPage } from './alta-admins.page';

describe('AltaAdminsPage', () => {
  let component: AltaAdminsPage;
  let fixture: ComponentFixture<AltaAdminsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaAdminsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaAdminsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
