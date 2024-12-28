import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { PokemonComponent } from './components/pages/pokemon/pokemon.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'pokemon', component: PokemonComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
];
