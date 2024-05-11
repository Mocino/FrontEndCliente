import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContantoEliminarComponent } from './contanto-eliminar.component';

describe('ContantoEliminarComponent', () => {
  let component: ContantoEliminarComponent;
  let fixture: ComponentFixture<ContantoEliminarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContantoEliminarComponent]
    });
    fixture = TestBed.createComponent(ContantoEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
