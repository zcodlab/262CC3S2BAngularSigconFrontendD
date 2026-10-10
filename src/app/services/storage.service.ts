import { Injectable,inject,PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserSesion } from '../model/user-sesion';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
    //permite identificar en que plataforma se está ejecutando la aplicación,
    // por ejemplo, en el navegador o en el servidor.
    private platformId = inject(PLATFORM_ID);
        sessionService = inject(SessionService);

    getItem(key: string): string | null {
      if (isPlatformBrowser(this.platformId)) {
        return localStorage.getItem(key);
      }
      return null;
    }

    setItem(key: string, value: string): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(key, value);
      }
    }

    removeItem(key: string): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(key);
      }
    }

    clear(): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.clear();
      }
    }

    verificarSession(): boolean | undefined {
      if (isPlatformBrowser(this.platformId)) {
        return !!localStorage.getItem("user_token");
      }
      return undefined;
    }

    getUserSession(): UserSesion | null  {
      return this.sessionService.getInfoSession();
    }

}
