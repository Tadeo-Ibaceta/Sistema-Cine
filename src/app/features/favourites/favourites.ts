import { Component, inject, input } from '@angular/core';
import { FavouritesService } from '../../core/services/favourites.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Favourite } from '../../core/models/favourite.interface';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-favourites',
  styleUrl: './favourites.css',
  templateUrl: './favourites.html',
})
export class Favourites {
  favoritosService = inject(FavouritesService);
  private fb = inject(FormBuilder);
  
  // Exponemos el signal al template
  favoritos = this.favoritosService.favoritos;

  // Estado para la edición
  editandoId: string | null = null;
  notaControl = this.fb.control('', Validators.maxLength(200));

  ngOnInit() {
    this.favoritosService.cargarFavoritos();
  }

  eliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta pelicula de tus favoritos?')) {
      this.favoritosService.eliminarFavorito(id);
    }
  }

  iniciarEdicion(fav: Favourite) {
    this.editandoId = fav.id!;
    this.notaControl.setValue(fav.nota);
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.notaControl.reset();
  }

  async guardarNota(id: string) {
    if (this.notaControl.valid) {
      await this.favoritosService.actualizarNota(id, this.notaControl.value || '');
      this.editandoId = null;
    }
  }
}
