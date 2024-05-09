import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, skip } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual: BehaviorSubject<Usuario | undefined> = new BehaviorSubject<Usuario | undefined>(undefined);
  logueado: boolean = false;
  firstRun: boolean = true;

  constructor(private auth: Auth, private _http: HttpClient, private _servUsuario: UsuarioService) {

    this._servUsuario.Ready().then(
      (ready: boolean) => {
        this.auth.onAuthStateChanged(
          async (user: User | null) => {
            //console.log("authStateChange", user);
            this.firstRun = false;

            this.usuarioActual.next(await this.BuscarUsuarioActual());
            this.logueado = this.usuarioActual.value != undefined;
            //console.log("usuario actual", this.usuarioActual.value);
          }
        );

        //Para que los datos sean reactivos
        this._servUsuario.usuarios.subscribe(
          async (usuarios: Usuario[]) => {
            //console.log("AuthService usuarios", usuarios);

            this.usuarioActual.next(await this.BuscarUsuarioActual());
            this.logueado = this.usuarioActual.value != undefined;
          }
        );
      }
    ).catch(
      (error) => {
        console.log("AuthService Ready", error);
      }
    );

  }

  async BuscarUsuarioActual(): Promise<Usuario | undefined> {
    let _usuario: Usuario | undefined = undefined;
    //console.log("CurrentUser al inicio BuscarUsuarioActual", this.auth.currentUser);

    if (this.auth.currentUser != null) {
      let usuarios: Usuario[] = this._servUsuario.usuarios.value;

      if (this._servUsuario.firstRun) {
        //console.log("firstRun UsuarioService", usuarios);
        usuarios = await firstValueFrom(this._servUsuario.usuarios.pipe(skip(1)));
      }

      //console.log("Usuarios luego de revisar firstRun usuario", usuarios);

      for (let u = 0; u < usuarios.length; u++) {
        if (usuarios[u].uid == this.auth.currentUser.uid) {
          _usuario = usuarios[u];
          break;
        }
      }
    }

    //console.log("Resultado de que usuario al finalizar BuscarUsuarioActual", _usuario);
    return _usuario;
  }

  async LogInEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (datos) => {
        //console.log(datos);
        this._servUsuario.LoginLog(datos.user.uid, email);
        return datos;
      }
    ).catch(
      (error) => {
        //console.log(error.code);
        throw new Error(this.errorParser(error.code));
      }
    );
  }

  async LogOut() {
    //this.usuarioActual.next(undefined);
    return this.auth.signOut();
  }

  async RegistrarUsuarioConEmail(usuario: Usuario, password: string): Promise<Usuario> {
    usuario.uid = await createUserWithEmailAndPassword(this.auth, usuario.email, password).then(
      (user: UserCredential) => {
        this._servUsuario.LoginLog(user.user.uid, usuario.email);
        return user.user.uid;
      }
    ).catch(
      (error) => {
        //console.log(error);
        if (error.code) {
          throw new Error(this.errorParser(error.code));
        }

        throw new Error(error);
      }
    );

    //console.log("usuario ya creado", usuario);

    if (usuario.uid != undefined && usuario.uid != null && usuario.uid != "" && usuario.uid != "new") {
      return this._servUsuario.Modificar(usuario).then(
        () => {
          //console.log('Usuario agregado');
          return usuario;
        }
      ).catch(
        (error) => {
          console.log("Agregar Usuario", error);
          throw new Error(error);
        }
      );
    }

    throw new Error("Error al registrar usuario");
  }

  async OlvideClave(email: string) {
    await sendPasswordResetEmail(this.auth, email).then(
      (datos) => {
        //console.log(datos);
        return Promise.resolve(datos);
      }
    ).catch(
      (error) => {
        //console.log(error.code);
        return Promise.reject(this.errorParser(error.code));
      }
    );
  }

  async BorraUsuario(uid: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `key=${this.auth.app.options.apiKey}`
    };

    //let url: string = 'https://www.googleapis.com/identitytoolkit/v3/accounts';
    let url: string = `https://corsproxy.io/?https://firebase.googleapis.com/v1/projects/${this.auth.app.options.projectId}/users/${uid}`;


    return firstValueFrom(this._http.delete(url, { headers })).then(
      (response: any) => {
        //console.log(response);
        const ID_USER: string = response.localId;
        //console.log(ID_USER);
        return ID_USER;
      }
    ).catch(
      (error) => {
        console.log(error);
        //console.log(error.error.error.message);
        return Promise.reject(this.errorParser(error.code));
      }
    );
  }

  async IsLoggedIn(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 0));

    if (this.firstRun) {
      //console.log("firstRun AuthService IsLoggedIn");
      await firstValueFrom(this.usuarioActual.pipe(skip(1)));
    }

    return this.usuarioActual.value != undefined;
  }

  errorParser(error: string): string {
    let errorCodes: { [key: string]: string } = {
      "auth/wrong-password": "Clave incorrecta",
      "auth/user-not-found": "No se encontró ese mail",
      "auth/invalid-email": "El mail ingresado no es válido",
      "auth/email-already-in-use": "El mail ingresado ya está en uso",
      "auth/weak-password": "La clave debe tener al menos 6 caracteres",
      "auth/too-many-requests": "Demasiados intentos fallidos. Intente más tarde",
      "auth/network-request-failed": "Error de conexión. Intente más tarde",
      "auth/invalid-login-credentials": "Revise si su mail y contraseña son correctos",
      "auth/missing-password": "Debe ingresar una clave",
      "auth/missing-email": "Debe ingresar un mail",
      "auth/user-disabled": "La cuenta de usuario está deshabilitada",
      "auth/user-not-authorized": "El usuario no tiene permiso para realizar la acción solicitada",
      "auth/quota-exceeded": "Se ha superado el límite de solicitudes",
    };

    return errorCodes[error] || `Error desconocido. (${error})`;
  }
}