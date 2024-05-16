import { Injectable } from '@angular/core';
import { Mensaje } from '../clases/mensaje';
import { BehaviorSubject, firstValueFrom, skip } from 'rxjs';
import { CollectionReference, DocumentData, Firestore, Query, collection, collectionData, doc, orderBy, query, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  mensajes: BehaviorSubject<Mensaje[]> = new BehaviorSubject<Mensaje[]>([]);
  firstRun: boolean = true;

  pathUrl: string = 'mensajes';
  rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);

  constructor(private firestore: Firestore) {
    this.CargarSubscripcion();
  }

  TraerTodos() {
    let _query: Query<Mensaje, DocumentData> = query(
      this.rootRef,
      orderBy('fecha', 'asc')
    ) as Query<Mensaje, DocumentData>;
    return collectionData<Mensaje>(_query);
  }

  CargarSubscripcion() {
    this.TraerTodos().subscribe(
      (mensajes: Mensaje[]) => {
        this.mensajes.next(mensajes);
        this.firstRun = false;
        //console.log("Mensajes cargados", "Cant: " + this.mensajes.value.length);
      }
    );
  }

  Nuevo(_mensaje: Mensaje) {
    if (_mensaje.nombre == "") {
      throw new Error("No se puede agregar un mensaje sin nombre.");
    }

    if (_mensaje.mensaje == "") {
      throw new Error("No se puede agregar un mensaje sin contenido.");
    }

    _mensaje.fecha = new Date();
    let docRef = doc(this.rootRef);
    return setDoc(docRef, _mensaje);
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      //console.log("firstRun MensajeService READY");
      await firstValueFrom(this.mensajes.pipe(skip(1)));
    }

    return !this.firstRun;
  }
}
