import { NgModule } from '@angular/core';
import { AuthService } from './servicios/auth.service';
import { UsuarioService } from './servicios/usuario.service';

@NgModule({
  declarations: [],
  imports: [
  ], providers: [
    AuthService,
    UsuarioService
  ]
})
export class AuthModule { }
