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
  comentarioControl = this.fb.control('', Validators.maxLength(200));

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
    this.comentarioControl.setValue(fav.comentario);
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.comentarioControl.reset();
  }

  calificar(id: string | undefined, estrellas: string) {
    if (!id) return;
    this.favoritosService.actualizarNota(id, estrellas);
  }

  async guardarComentario(id: string) {
    if (this.comentarioControl.valid) {
      await this.favoritosService.actualizarComentario(id, this.comentarioControl.value || '');
      this.editandoId = null;
    }
  }
}
