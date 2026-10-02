import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRequest } from '../../../model/api/request/user-request';
import { UserResponse } from '../../../model/api/response/user-response';

@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {
  location = inject(Location);
  router = inject(Router);
  authService = inject(AuthService);
  userRequest:UserRequest={} as UserRequest;
  userResponse:UserResponse={} as UserResponse;

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
        //this.toastService.show('Ingreso exitoso', 'success');
        alert('Ingreso exitoso')
        this.router.navigate(['/principal']);
      },
      (err:any)=>{
        console.log(err);
        console.log('Login failed');
        alert('Ingreso fallido')
        //this.toastService.show('Ingreso fallido', 'danger');
      }

    );

  }//end login

  onBack() {
    this.location.back();
  }

}
