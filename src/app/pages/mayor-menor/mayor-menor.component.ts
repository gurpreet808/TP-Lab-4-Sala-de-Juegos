import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Carta } from './clases/carta';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnInit {
  mazoDeCartas: Carta[] = [];
  cartaActual: Carta | undefined;
  puntos: number = 0;
  cartasRestantes: number = 0;
  juegoTerminado: boolean = false;
  palos: string[] = ['oro', 'copa', 'espada', 'basto'];
  cantidad_maxima: number = 12;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.puntos = 0;
    this.mazoDeCartas = this.barajar(this.crearMazoDeCartas());
    this.mostrarSiguienteCarta();
  }

  crearMazoDeCartas(): Carta[] {
    const mazo: Carta[] = [];

    for (let i = 1; i <= this.cantidad_maxima; i++) {
      for (let j = 0; j < this.palos.length; j++) {
        let carta: Carta = {
          numero: i,
          palo: this.palos[j],
          imagen: `assets/cartas/${this.palos[j]}_${i}.png`
        };
        mazo.push(carta);
      }
    }

    return mazo;
  }

  barajar(mazo: Carta[]): Carta[] {
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
    return mazo;
  }

  mostrarSiguienteCarta() {
    if (this.mazoDeCartas.length > 0) {
      this.cartaActual = this.mazoDeCartas.pop();

      //Si la carta actual es igual a la anterior volver a mezclar
      if (this.mazoDeCartas.length > 0 && this.cartaActual!.numero === this.mazoDeCartas[this.mazoDeCartas.length - 1].numero) {
        console.log('numero repetido');
        this.mazoDeCartas = this.barajar(this.mazoDeCartas);
        this.mostrarSiguienteCarta();
      }
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Fin del juego', detail: 'Se han agotado las cartas en el mazo.' });
    }
    this.cartasRestantes = this.mazoDeCartas.length;
    this.juegoTerminado = this.mazoDeCartas.length === 0;
  }

  verificarAdivinanza(esMayor: boolean) {
    if (this.mazoDeCartas.length === 0) {
      this.juegoTerminado = true;
      this.messageService.add({ severity: 'warning', summary: 'Fin del juego', detail: 'Se han agotado las cartas en el mazo.' });
    } else {
      const siguienteCarta: Carta = this.mazoDeCartas[this.mazoDeCartas.length - 1];
      if ((esMayor && siguienteCarta.numero > this.cartaActual!.numero) || (!esMayor && siguienteCarta.numero < this.cartaActual!.numero)) {
        this.puntos++;
        this.messageService.add({ severity: 'success', summary: 'Adivinaste', detail: '¡Has acertado!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Fallaste', detail: '¡No has acertado!' });
      }

      this.mostrarSiguienteCarta();
    }
  }

  reiniciarJuego() {
    this.iniciarJuego();
  }
}