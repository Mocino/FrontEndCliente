import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteAgregarAdminComponent } from './cliente-agregar-admin.component';

describe('ClienteAgregarAdminComponent', () => {
  let component: ClienteAgregarAdminComponent;
  let fixture: ComponentFixture<ClienteAgregarAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteAgregarAdminComponent]
    });
    fixture = TestBed.createComponent(ClienteAgregarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
