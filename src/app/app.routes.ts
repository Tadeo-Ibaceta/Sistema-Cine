import { Routes } from '@angular/router';
import { UpcomingMovies } from './features/upcoming-movies/upcoming-movies';
import { Favourites } from './features/favourites/favourites';
import { CandyBar } from './features/candy-bar/candy-bar';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    { path: 'upcoming-movies', component: UpcomingMovies },

    { path: 'favourites', component: Favourites },

    { path: 'candy-bar', component: CandyBar },

    { path: 'home',
        loadComponent: () => import("./features/home/home").then(c => c.Home),
        children: [
        // Ruta hija con parámetro dinámico ':id'
            { path: 'movie/:id', 
                loadComponent: () => import('./features/movie-detail/movie-detail').then(c => c.MovieDetail)
            }
        ]
    },

    { path: 'login', component: Login},

    { path: 'register', component: Register},

    // Wildcard: cualquier ruta no definida redirige a /home
    { path: '**', redirectTo: '/home' }
];
