import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autorPropio',
  standalone: true
})
export class AutorPropioPipe implements PipeTransform {

  transform(nombre: string, usuarioActual: string): string {
    if (nombre == usuarioActual) {
      return 'Tú';
    }

    return nombre;
  }

}
