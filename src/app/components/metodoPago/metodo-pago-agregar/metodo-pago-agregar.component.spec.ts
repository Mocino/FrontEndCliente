import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoAgregarComponent } from './metodo-pago-agregar.component';

describe('MetodoPagoAgregarComponent', () => {
  let component: MetodoPagoAgregarComponent;
  let fixture: ComponentFixture<MetodoPagoAgregarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetodoPagoAgregarComponent]
    });
    fixture = TestBed.createComponent(MetodoPagoAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
