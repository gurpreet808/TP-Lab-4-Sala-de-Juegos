import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  items = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      routerLink: '/'
    },
    {
      label: 'Login',
      icon: 'fa-solid fa-sign-in-alt',
      routerLink: '/login'
    },
    {
      label: 'Quién Soy',
      icon: 'fa-regular fa-lightbulb',
      routerLink: '/quien-soy'
    },
    {
      label: 'Juegos',
      icon: 'fas fa-gamepad',
      items: [
        {
          label: 'Ahorcado',
          routerLink: '/ahorcado'
        },
        {
          label: 'Mayor o Menor',
          routerLink: '/mayor-menor'
        },
        {
          label: 'Preguntados',
          routerLink: '/preguntados'
        }
      ]
    },
    {
      label: 'Sala de Chat',
      icon: 'far fa-comments',
      routerLink: '/sala-chat'
    }
  ];

  constructor(private router: Router) { }

  Desloguear() {
    //this.servUsuario.LogOut();
    this.router.navigateByUrl('/login');
  }
}
