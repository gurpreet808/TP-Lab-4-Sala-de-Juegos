import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Usuario } from '../../modulos/auth/clases/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  correo: string = "";
  clave: string = "";
  clave2: string = "";

  constructor(public servAuth: AuthService, private router: Router, public messageService: MessageService) {
    this.servAuth.IsLoggedIn().then(
      (rta: any) => {
        console.log(rta);
        if (rta) {
          this.router.navigate(['/']);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  Registrarme() {
    console.log("regisrarme");
    //validar que los campos no estén vacíos, hacer uno por uno y mostrar el mensaje correspondiente
    if (this.correo == "") {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: "El correo electrónico no puede estar vacío" });
      return;
    }

    if (this.clave == "") {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: "La contraseña no puede estar vacía" });
      return;
    }

    if (this.clave2 == "") {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: "La confirmación de la contraseña no puede estar vacía" });
      return;
    }

    if (this.clave != this.clave2) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: "Las contraseñas no coinciden" });
      return;
    }

    let usuario_nuevo: Usuario = {
      email: this.correo,
      uid: "new",
      fecha_creacion: new Date().getTime(),
      fecha_modificacion: new Date().getTime()
    };

    this.servAuth.RegistrarUsuarioConEmail(usuario_nuevo, this.clave).then(
      (res) => {
        //console.log(res);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Listo', detail: "Se creó tu cuenta con el correo: " + this.correo + "." });
        this.router.navigate(['/']);
      }
    ).catch(
      (err: any) => {
        //console.log(err);
        if (typeof err === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: err });
        } else if (err instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: err.message });
        } else {
          console.error("Registrarme", err);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(err) });
        }
      }
    );
  }

  IrLogin() {
    this.router.navigate(['/login']);
  }
}
