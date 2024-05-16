import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../modulos/auth/clases/usuario';

@Pipe({
  name: 'autorPropio',
  standalone: true
})
export class AutorPropioPipe implements PipeTransform {

  transform(nombre: string, usuario: Usuario): unknown {
    if (nombre == usuario.email) {
      return 'Tú';
    }

    return nombre;
  }

}
