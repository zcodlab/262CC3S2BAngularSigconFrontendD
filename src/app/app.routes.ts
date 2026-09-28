import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { InicioSesion } from './components/acceso/inicio-sesion/inicio-sesion';
import { Principal } from './components/principal/principal';

export const routes: Routes = [
  { path:'',component:Home},
  { path:'login',component:InicioSesion},
  { path:'principal',component:Principal},
  { path: '**', redirectTo:''},
];
