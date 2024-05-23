import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "registrarme", loadComponent: () => import('./pages/registro/registro.component').then(c => c.RegistroComponent) },
    { path: "quien-soy", loadComponent: () => import('./pages/quien-soy/quien-soy.component').then(c => c.QuienSoyComponent) },
    { path: "ahorcado", loadComponent: () => import('./pages/ahorcado/ahorcado.component').then(c => c.AhorcadoComponent) },
    { path: "mayor-menor", loadComponent: () => import('./pages/mayor-menor/mayor-menor.component').then(c => c.MayorMenorComponent) },
    { path: "preguntados", loadComponent: () => import('./pages/preguntados/preguntados.component').then(c => c.PreguntadosComponent) },
    { path: "cromainstinct", loadComponent: () => import('./pages/croma-instinct/croma-instinct.component').then(c => c.CromaInstinctComponent) },
    { path: "sala-chat", loadComponent: () => import('./pages/sala-chat/sala-chat.component').then(c => c.SalaChatComponent) },
    { path: "**", component: Error404Component }
];
