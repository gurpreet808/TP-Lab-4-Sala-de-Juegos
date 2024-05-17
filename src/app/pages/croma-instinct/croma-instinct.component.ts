import { Component } from '@angular/core';
import { Color } from './clases/color';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-croma-instinct',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './croma-instinct.component.html',
  styleUrl: './croma-instinct.component.scss'
})
export class CromaInstinctComponent {

  tiempoRestante: number = 10;
  puntaje: number = 0;
  colorNombre: number = -1;
  colorFondo: number = -1;
  juegoFinalizado: boolean = true;
  colores: Color[] = [
    { nombre: 'Rojo', fondo: '#FF0000' },
    { nombre: 'Verde', fondo: '#00FF00' },
    { nombre: 'Azul', fondo: '#0000FF' },
    { nombre: 'Amarillo', fondo: '#FFFF00' },
    { nombre: 'Naranja', fondo: '#FFA500' },
    { nombre: 'Rosa', fondo: '#FFC0CB' },
    { nombre: 'Morado', fondo: '#800080' },
    { nombre: 'Gris', fondo: '#808080' }
  ];

  constructor() {
    //this.iniciarJuego();
  }

  ngOnInit() {
  }

  iniciarJuego() {
    this.juegoFinalizado = false;
    this.actualizarColorYTexto();
    this.iniciarTemporizador();
  }

  actualizarColorYTexto() {
    this.colorNombre = this.generarNumeroAleatorio(this.colores.length);
    this.colorFondo = this.generarNumeroAleatorio(this.colores.length);
  }

  generarNumeroAleatorio(max: number) {
    return Math.floor(Math.random() * max);
  }

  iniciarTemporizador() {
    this.tiempoRestante = 10;
    const temporizador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        clearInterval(temporizador);
        this.juegoFinalizado = true;
      }
    }, 1000);
  }

  verificarRespuesta(coincide: boolean) {
    if (this.colorNombre === this.colorFondo) {
      if (coincide) {
        this.puntaje++;
      } else {
        if (this.puntaje > 0) {
          this.puntaje--;
        }
      }
    } else {
      if (coincide) {
        if (this.puntaje > 0) {
          this.puntaje--;
        }
      } else {
        this.puntaje++;
      }
    }
    this.actualizarColorYTexto();
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.iniciarJuego();
  }
}

