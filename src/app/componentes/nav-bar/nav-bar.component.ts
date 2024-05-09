import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../modulos/auth/servicios/auth.service';

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

  constructor(private router: Router, public servAuth: AuthService) {
    //Luego se reemplaza por guard
    this.servAuth.IsLoggedIn().then(
      (rta: any) => {
        console.log(rta);
        if (rta == false) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  Desloguear() {
    this.servAuth.LogOut().then(
      () => {
        this.router.navigateByUrl('/login');
      }
    ).catch(
      (error) => {
        console.log("Error en deslogueo", error);
      }
    );
  }
}
