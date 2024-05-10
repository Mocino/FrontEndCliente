import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoListaComponent } from './metodo-pago-lista.component';

describe('MetodoPagoListaComponent', () => {
  let component: MetodoPagoListaComponent;
  let fixture: ComponentFixture<MetodoPagoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetodoPagoListaComponent]
    });
    fixture = TestBed.createComponent(MetodoPagoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
