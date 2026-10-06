import { Routes } from '@angular/router';
import { UpcomingMovies } from './features/upcoming-movies/upcoming-movies';
import { Favourites } from './features/favourites/favourites';
import { CandyBar } from './features/candy-bar/candy-bar';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    
    { path: '', loadComponent: () => import('./features/home/home').then(c => c.Home)},

    { path: 'upcoming-movies', loadComponent: () => import('./features/upcoming-movies/upcoming-movies').then(c => c.UpcomingMovies) },

    { path: 'favourites', loadComponent: () => import('./features/favourites/favourites').then(c => c.Favourites) },

    { path: 'candy-bar', loadComponent: () => import('./features/candy-bar/candy-bar').then(c => c.CandyBar)},

    { path: 'home',
        loadComponent: () => import("./features/home/home").then(c => c.Home),
        children: [
        // Ruta hija con parámetro dinámico ':id'
            { path: 'movie/:id', 
                loadComponent: () => import('./features/movie-detail/movie-detail').then(c => c.MovieDetail)
            }
        ]
    },

    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(c => c.Login)},

    { path: 'register', loadComponent: () => import('./features/auth/register/register').then(c => c.Register)},

    // Wildcard: cualquier ruta no definida redirige a /home
    { path: '**', redirectTo: '/home' }
];
