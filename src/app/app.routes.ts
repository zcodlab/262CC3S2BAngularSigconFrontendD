import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { InicioSesion } from './components/acceso/inicio-sesion/inicio-sesion';
import { Principal } from './components/principal/principal';
import { RegistrarPersona } from './components/gestion-mantenimiento/registrar-persona/registrar-persona';
import { RegistrarProveedor } from './components/gestion-mantenimiento/registrar-proveedor/registrar-proveedor';
import { SeguimientoSolicitudCotizacion } from './components/gestion-servicios/seguimiento-solicitud-cotizacion/seguimiento-solicitud-cotizacion';
import { RegistrarRol } from './components/gestion-mantenimiento/registrar-rol/registrar-rol';
import { RegistrarModulo } from './components/gestion-mantenimiento/registrar-modulo/registrar-modulo';
import { ChartPersona } from './components/dashboards/chart-persona/chart-persona';
// Importar los guards
import { authGuard } from './guards/auth-guard';
import { moduloGuard } from './guards/modulo-guard';

export const routes: Routes = [
  { path:'',component:Home},
  { path:'login',component:InicioSesion},
  { path: 'principal', component: Principal,
    canActivate: [authGuard], // Bloquea todo /principal si no hay sesión
    children:[
      { path: 'Inicio', component: ChartPersona,
        canActivate: [moduloGuard]
      },
      { path: 'RegistrarPersona', component: RegistrarPersona,
        canActivate: [moduloGuard] // Valida que el usuario tenga acceso a este submódulo
      },
      { path: 'RegistrarProveedor', component: RegistrarProveedor,
        canActivate: [moduloGuard]
      },
      { path: 'SeguimientoSolicitudCotizacion', component: SeguimientoSolicitudCotizacion,
        canActivate: [moduloGuard]
      },
      { path: 'RegistrarRol', component: RegistrarRol,
        canActivate: [moduloGuard]
      },
      { path: 'RegistrarModulos', component: RegistrarModulo,
        canActivate: [moduloGuard]
      },
  ]},
  { path: '**', redirectTo:''},
];
