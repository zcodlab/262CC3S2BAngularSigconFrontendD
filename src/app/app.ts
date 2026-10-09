import { Component, signal,inject, OnInit } from '@angular/core';
import {CommonModule,AsyncPipe} from '@angular/common';
import { RouterOutlet} from '@angular/router';
import { LoadingService } from './services/loading.service';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,AsyncPipe,ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('262CC3S2BAngularSigconFrontend');
  loadingService=inject(LoadingService)

  ngOnInit(): void {
  }

  logout(){
  }
}
