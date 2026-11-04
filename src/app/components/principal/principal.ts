import { Component, OnInit, inject } from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { UserSesion } from '../../model/user-sesion';

@Component({
  selector: 'app-principal',
  imports: [RouterModule],
  templateUrl: './principal.html',
  styleUrl: './principal.scss',
})
export class Principal implements OnInit{
  router=inject(Router);
  authService=inject(AuthService);
  sessionService=inject(SessionService);
  user:UserSesion|null=null;

  ngOnInit(): void {
    this.user=this.sessionService.getInfoSession();
    if (this.user && this.user.modulos && this.router.url === '/principal') {
      const firstModule = this.user.modulos.find(m => m.ordenOpcion === 1);
      if (firstModule) {
        this.router.navigate(['/principal', firstModule.url]);
      }
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
