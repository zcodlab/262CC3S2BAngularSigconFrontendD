import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { InicioSesion } from './components/acceso/inicio-sesion/inicio-sesion';
import { Principal } from './components/principal/principal';
import { RegistrarPersona } from './components/gestion-mantenimiento/registrar-persona/registrar-persona';
import { RegistrarProveedor } from './components/gestion-mantenimiento/registrar-proveedor/registrar-proveedor';
import { SeguimientoSolicitudCotizacion } from './components/gestion-servicios/seguimiento-solicitud-cotizacion/seguimiento-solicitud-cotizacion';
// Importar los guards
import { authGuard } from './guards/auth-guard';
import { moduloGuard } from './guards/modulo-guard';

export const routes: Routes = [
  { path:'',component:Home},
  { path:'login',component:InicioSesion},
  { path: 'principal', component: Principal,
    canActivate: [authGuard], // Bloquea todo /principal si no hay sesión
    children:[
      { path: 'RegistrarPersona', component: RegistrarPersona,
        canActivate: [moduloGuard] // Valida que el usuario tenga acceso a este submódulo
      },
      { path: 'RegistrarProveedor', component: RegistrarProveedor,
        canActivate: [moduloGuard] // Valida que el usuario tenga acceso a este submódulo
      },
      { path: 'SeguimientoSolicitudCotizacion', component: SeguimientoSolicitudCotizacion,
        canActivate: [moduloGuard] // Valida que el usuario tenga acceso a este submódulo
      },
  ]},
  { path: '**', redirectTo:''},
];
