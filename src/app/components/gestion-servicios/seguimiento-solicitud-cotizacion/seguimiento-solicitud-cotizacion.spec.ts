import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoSolicitudCotizacion } from './seguimiento-solicitud-cotizacion';

describe('SeguimientoSolicitudCotizacion', () => {
  let component: SeguimientoSolicitudCotizacion;
  let fixture: ComponentFixture<SeguimientoSolicitudCotizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoSolicitudCotizacion],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguimientoSolicitudCotizacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
