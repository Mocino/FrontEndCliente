import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContantoListaComponent } from './contanto-lista.component';

describe('ContantoListaComponent', () => {
  let component: ContantoListaComponent;
  let fixture: ComponentFixture<ContantoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContantoListaComponent]
    });
    fixture = TestBed.createComponent(ContantoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
