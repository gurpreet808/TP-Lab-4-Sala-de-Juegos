import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, skip } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { CollectionReference, DocumentData, Firestore, Query, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  firstRun: boolean = true;

  pathUrl: string = 'usuarios';
  rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);
  loginlogsRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, 'loginlogs');

  constructor(private firestore: Firestore) {
    this.CargarSubscripcion();
  }

  TraerTodos() {
    let query: Query<Usuario, DocumentData> = this.rootRef as Query<Usuario, DocumentData>;
    return collectionData<Usuario>(query, { idField: 'uid' });
  }

  CargarSubscripcion() {
    this.TraerTodos().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios.next(usuarios);
        this.firstRun = false;
        //console.log("Usuarios cargados", "Cant: " + this.usuarios.value.length);
      }
    );
  }

  Nuevo(_usuario: Usuario) {
    //Agregar validaciones necesarias y si algo no esta bien, lanzar un error
    _usuario.fecha_creacion = Date.now();
    _usuario.fecha_modificacion = Date.now();
    return this.Modificar(_usuario);
  }

  Modificar(_usuario: Usuario) {
    //Agregar validaciones necesarias y si algo no esta bien, lanzar un error
    _usuario.fecha_modificacion = Date.now();
    let docRef = doc(this.rootRef, _usuario.uid);
    return setDoc(docRef, _usuario);
  }

  Borrar(uid: string) {
    let docRef = doc(this.rootRef, uid);
    return deleteDoc(docRef);
  }

  async BuscarPorUID(uid: string): Promise<Usuario> {
    let usuario: Usuario | undefined = this.usuarios.value.find(u => u.uid == uid);
    if (usuario == undefined) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }

  async BuscarPorEmail(email: string): Promise<Usuario> {
    let usuario: Usuario | undefined = this.usuarios.value.find(u => u.email == email);
    if (usuario == undefined) {
      throw new Error("Usuario no encontrado");
    }

    return usuario;
  }

  LoginLog(uid: string, email: string) {
    let log = {
      fecha: Date.now(),
      uid: uid,
      correo: email
    };
    let docRef = doc(this.loginlogsRef);
    return setDoc(docRef, log);
  }

  TraerLoginLogs(){
    let query: Query<DocumentData, DocumentData> = this.loginlogsRef;
    return collectionData<DocumentData>(query, { idField: 'uid' });
  }

  ClonarUsuario(_usuario: Usuario) {
    return JSON.parse(JSON.stringify(_usuario));
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      console.log("firstRun UsuarioService READY");
      await firstValueFrom(this.usuarios.pipe(skip(1)));
    }

    return !this.firstRun;
  }
}
