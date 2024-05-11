import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoEliminarComponent } from './metodo-pago-eliminar.component';

describe('MetodoPagoEliminarComponent', () => {
  let component: MetodoPagoEliminarComponent;
  let fixture: ComponentFixture<MetodoPagoEliminarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetodoPagoEliminarComponent]
    });
    fixture = TestBed.createComponent(MetodoPagoEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
