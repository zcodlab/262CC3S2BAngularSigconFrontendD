import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRequest } from '../../../model/api/request/user-request';
import { UserResponse } from '../../../model/api/response/user-response';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {
  router = inject(Router);
  authService = inject(AuthService);
  userRequest:UserRequest={} as UserRequest;
  userResponse:UserResponse={} as UserResponse;
  toastService=inject(ToastService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

 login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    if (!email || !password) return;

    this.userRequest.email=email;
    this.userRequest.password=password;

    this.authService.login(this.userRequest).subscribe(
      (result: UserResponse)=>{
        this.userResponse=result;
        console.log(this.userResponse);
        console.log('Login successful');
        this.authService.setToken(this.userResponse.token);
        this.router.navigate(['/principal']);
      },
      (err: HttpErrorResponse)=>{
        const mensajeError = err.error?.message || 'Ingreso fallido';
        this.toastService.show(mensajeError, 'danger');
      }

    );

  }//end login

  onBack() {
    this.router.navigate(['']);
  }

}
