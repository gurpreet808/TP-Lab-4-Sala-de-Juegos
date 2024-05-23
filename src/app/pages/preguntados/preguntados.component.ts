import { Component, OnInit } from '@angular/core';
import { PaisService } from './servicios/pais.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit {
  idPaisElegido: number = -1;
  opcionesPaises: number[] = [];
  rondaFinalizada: boolean = false;
  ganoRonda: boolean = false;
  rondas: number = 10;
  rondaActual: number = 0;
  puntaje: number = 0;

  constructor(public servPaises: PaisService, public messageService: MessageService) {
  }

  ngOnInit(): void {
    this.servPaises.CargarPaises("/region/america").then(
      () => {
        this.IniciarJuego();
      }
    );
  }

  async IniciarJuego() {
    this.rondaFinalizada = false;
    this.ganoRonda = false;
    this.rondaActual = 0;
    this.puntaje = 0;
    this.IniciarRonda();
  }

  async IniciarRonda() {
    if (this.rondaActual < this.rondas) {
      this.ElegirPaisAleatorio();
      this.ElegirOpcionesAleatorias(this.idPaisElegido);
      this.rondaActual++;
      this.rondaFinalizada = false;

      //console.log(this.servPaises.paises[this.idPaisElegido]);
      //console.log(this.opcionesPaises);
      console.log(this.rondaActual);
    } else {
      this.messageService.add({ severity: 'info', summary: 'Fin del juego', detail: 'No hay más rondas' });
    }
  }

  ElegirPaisAleatorio() {
    this.idPaisElegido = Math.floor(Math.random() * this.servPaises.paises.length);
  }

  ElegirOpcionesAleatorias(idPaisElegido: number) {
    this.opcionesPaises = [];
    let opciones = 3;
    while (opciones > 0) {
      let idPais = Math.floor(Math.random() * this.servPaises.paises.length);
      if (idPais != idPaisElegido && !this.opcionesPaises.includes(idPais)) {
        this.opcionesPaises.push(idPais);
        opciones--;
      }
    }
    this.opcionesPaises.push(idPaisElegido);
    this.opcionesPaises.sort(() => Math.random() - 0.5);
  }

  ElegirOpcion(idPais: number) {
    if (idPais == this.idPaisElegido) {
      this.puntaje++;
      this.ganoRonda = true;
      this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Acertaste!' });
    } else {
      this.ganoRonda = false;
      this.messageService.add({ severity: 'error', summary: 'Incorrecto', detail: 'Fallaste!' });
    }

    this.rondaFinalizada = true;
  }

  ReiniciarJuego() {
    this.IniciarJuego();
  }
}
