import { Injectable } from '@angular/core';
import { Pais } from '../clases/pais';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  paises: Pais[] = [];
  urlServidor: string = "https://restcountries.com";
  version: string = "/v3.1";

  constructor(public _miHttp: HttpClient) {
  }

  TraerPaises(path: string): Promise<Pais[]> {
    return firstValueFrom(
      this._miHttp.get<any[]>(this.urlServidor + this.version + path).pipe(
        map(
          (paises: any[]) => {
            return paises.map(
              (pais: any) => {
                return {
                  nombre: pais.translations.spa.common,
                  url_foto: pais.flags.svg
                }
              }
            );
          }
        )
      )
    );
  }

  async CargarPaises(path: string): Promise<void> {
    this.paises = await this.TraerPaises(path);
  }
}
