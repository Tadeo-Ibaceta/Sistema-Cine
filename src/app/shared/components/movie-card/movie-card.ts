import { Component, inject, input } from '@angular/core';
import { Movie } from '../../../core/models/movie.interface';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-movie-card',
  styleUrl: './movie-card.css',
  templateUrl: './movie-card.html',
})
export class MovieCard {

  authService = inject(AuthService);

  movie = input.required<Movie>();
}
