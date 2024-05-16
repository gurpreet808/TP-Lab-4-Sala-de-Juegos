import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit {
  letras: string[] = [];
  palabra_a_adivinar: string = '';
  intentos_restantes: number = 6;
  letras_adivinadas: string[] = [];
  palabra_oculta: string = '';
  finalizado: boolean = false;
  palabras: string[] = [
    'gato', 'perro', 'casa', 'coche',
  ];

  constructor(public messageService: MessageService) {
    this.ResetJuego();
  }

  ngOnInit(): void {
  }

  TecladoInit() {
    this.letras = 'abcdefghijklmnñopqrstuvwxyz'.toUpperCase().split('');
  }

  async PalabraAlAzar() {
    this.palabra_a_adivinar = this.palabras[Math.floor(Math.random() * this.palabras.length)].toUpperCase();
    //console.log(this.palabra_a_adivinar);

    this.palabra_oculta = '_'.repeat(this.palabra_a_adivinar.length);
  }

  ComprobarLetra(letra: string): boolean {
    if (this.palabra_a_adivinar.includes(letra)) {
      return true;
    }
    return false;
  }

  async ElegirLetra(letra: string) {
    //console.log(letra, this.ComprobarLetra(letra));
    this.letras.splice(this.letras.indexOf(letra), 1);

    if (this.ComprobarLetra(letra)) {
      this.letras_adivinadas.push(letra);
      await this.ActualizarPalabraOculta();

      if (this.palabra_a_adivinar.split('').every(letra => this.letras_adivinadas.includes(letra))) {
        this.Ganaste();
      }
    } else {
      this.intentos_restantes--;
      if (this.intentos_restantes == 0) {
        this.Perdiste();
      }
    }
  }

  async ActualizarPalabraOculta() {
    for (let x = 0; x < this.palabra_a_adivinar.length; x++) {
      if (this.letras_adivinadas.includes(this.palabra_a_adivinar[x])) {
        this.palabra_oculta = this.palabra_oculta.substr(0, x) + this.palabra_a_adivinar[x] + this.palabra_oculta.substr(x + 1);
      }
    }
  }

  async ResetJuego() {
    this.intentos_restantes = 6;
    this.letras_adivinadas = [];
    this.palabra_oculta = '';
    this.finalizado = false;
    this.TecladoInit();
    await this.PalabraAlAzar();
  }

  Ganaste() {
    this.finalizado = true;
    console.log('Ganaste');
    this.messageService.add({ severity: 'success', summary: 'Ganaste', detail: 'Felicidades, has ganado el juego! :)' });
  }

  Perdiste() {
    this.finalizado = true;
    console.log('Perdiste');
    this.messageService.add({ severity: 'error', summary: 'Perdiste', detail: 'Has perdido el juego, inténtalo de nuevo! :(' });
  }
}
