import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  correo: string = '';
  clave: string = '';

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/']);
  }

  olvideClave() {

  }

}
