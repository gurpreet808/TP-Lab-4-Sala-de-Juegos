import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { Error404Component } from './componentes/error404/error404.component';
import { RegistroComponent } from './componentes/registro/registro.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "registrarme", component: RegistroComponent },
    { path: "quien-soy", component: QuienSoyComponent },
    { path: "**", component: Error404Component }
];
