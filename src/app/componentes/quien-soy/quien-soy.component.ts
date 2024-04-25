import { Component } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.scss'
})
export class QuienSoyComponent {
  url_foto: string = "https://avatars.githubusercontent.com/u/17884026";
  nombre: string = 'Daniel Singh';
}
