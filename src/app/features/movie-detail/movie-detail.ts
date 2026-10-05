import { Component, computed, inject, input } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
import { Movie } from '../../core/models/movie.interface';
import { FavouritesService } from '../../core/services/favourites.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail {

  authService = inject(AuthService)
  id = input.required<string>();

  private movieService = inject(MovieService);
  private favoritosService = inject(FavouritesService);
  private router = inject(Router);

  movie = computed(() => {
    const todasLasPeliculas = this.movieService.movies();
    return todasLasPeliculas.find(m => m.id === this.id());
  });

  estadoStock = computed(() => {
    const movie = this.movie();
    if (!movie) return 'not-found';
    return movie.disponible;
  });

  agregarAFavoritos() {
    const favMovie = this.movie();
    if (!favMovie) {
      console.warn('La película aún no se ha cargado.');
      return;
    }
    this.favoritosService.agregarFavorito({
      movie_id: favMovie.id,
      nota: '',
      comentario: ''
    });
  }

  // Navegación programática — volver al listado
  volver(): void {
    this.router.navigate(['/home']);
  }

}
