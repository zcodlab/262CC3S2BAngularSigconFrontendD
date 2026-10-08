import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProveedor } from './registrar-proveedor';

describe('RegistrarProveedor', () => {
  let component: RegistrarProveedor;
  let fixture: ComponentFixture<RegistrarProveedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProveedor],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarProveedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
