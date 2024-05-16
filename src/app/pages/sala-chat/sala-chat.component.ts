import { Component, ElementRef, ViewChild } from '@angular/core';
import { Mensaje } from './clases/mensaje';
import { MensajeService } from './servicios/mensaje.service';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { AutorPropioPipe } from '../../pipes/autor-propio.pipe';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [
    FormsModule,
    AutorPropioPipe,
    DatePipe,
    ButtonModule
  ],
  templateUrl: './sala-chat.component.html',
  styleUrl: './sala-chat.component.scss'
})
export class SalaChatComponent {

  mensajes: Mensaje[] = [];
  mensaje: Mensaje = {
    id: '',
    nombre: '',
    mensaje: '',
    fecha: new Date()
  };
  @ViewChild('mensajes_container') mensajesContainer!: ElementRef;

  constructor(public servMensaje: MensajeService, public servUsuario: UsuarioService, public servAuth: AuthService) {
    this.servMensaje.TraerTodos().subscribe(
      (msj: Mensaje[]) => {
        for (let x = 0; x < msj.length; x++) {
          msj[x].fecha = new Date((msj[x].fecha as any)['seconds'] * 1000);
        }

        this.mensajes = msj;
        //console.log(this.mensajes);
        this.scrollDown();
      }
    );
  }

  enviarMensaje() {
    if (this.servAuth.usuarioActual.value) {
      this.mensaje.nombre = this.servAuth.usuarioActual.value.email;

      this.servMensaje.Nuevo(this.mensaje).then(
        (rdo: any) => {
          this.mensaje.mensaje = '';
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  async scrollDown() {
    const container = this.mensajesContainer.nativeElement;
    await new Promise(resolve => setTimeout(resolve, 1000));
    container.scroll({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }
}
