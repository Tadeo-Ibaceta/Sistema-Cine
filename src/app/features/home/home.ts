import { Component, computed, effect, inject, signal } from '@angular/core';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { Router, RouterOutlet } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';

@Component({
  imports: [MovieCard, SearchBar, RouterOutlet],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  private movieService = inject(MovieService);
  private router = inject(Router);

  // Ya no se duplican los datos en cada componente
  movies = this.movieService.movies;

    // signal() — estado mutable para el filtro de búsqueda
  filtroBusqueda = signal('');

  // Se recalcula automáticamente cuando cambia filtroBusqueda o peliculas
  peliculasFiltradas = computed(() => {
    const termino = this.filtroBusqueda().toLowerCase();
    if (!termino) {
      return this.movies();
    }
    return this.movies().filter(movie =>
      movie.nombre.toLowerCase().includes(termino) ||
      movie.genero.toLowerCase().includes(termino)
    );
  });

  constructor() {
    // effect() — ejecuta un efecto secundario cada vez que cambian los signals que lee
    effect(() => {
      console.log(`Filtro activo: "${this.filtroBusqueda()}" → ${this.peliculasFiltradas().length} resultados`);
    });
  }

  // Navegación programática con Router.navigate()
  // Navega a la ruta hija
  verDetalle(peliculaId: string): void {
    this.router.navigate(['/home/movie/', peliculaId]);
  }

}
