import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {
  location = inject(Location);
  router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    if (!email || !password){
      console.log('Login failed');
      return;
    }
    console.log('Login successful');
    this.router.navigate(['/principal']);
  }//end login

  onBack() {
    this.location.back();
  }

}
