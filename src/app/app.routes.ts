import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { InicioSesion } from './components/acceso/inicio-sesion/inicio-sesion';
import { Principal } from './components/principal/principal';
import { RegistrarPersona } from './components/gestion-mantenimiento/registrar-persona/registrar-persona';
import { RegistrarProveedor } from './components/gestion-mantenimiento/registrar-proveedor/registrar-proveedor';

export const routes: Routes = [
  { path:'',component:Home},
  { path:'login',component:InicioSesion},
  { path: 'principal', component: Principal,children:[
      { path: 'RegistrarPersona', component: RegistrarPersona},
      { path: 'RegistrarProveedor', component: RegistrarProveedor},
  ]},
  { path: '**', redirectTo:''},
];
