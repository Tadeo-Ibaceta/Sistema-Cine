import { Component, inject } from '@angular/core';
import { FoodCard } from '../../shared/components/food-card/food-card';
import { Food } from '../../core/models/food.interface';
import { FoodService } from '../../core/services/food.service';

@Component({
  imports: [FoodCard],
  selector: 'app-candy-bar',
  styleUrl: './candy-bar.css',
  templateUrl: './candy-bar.html',
})
export class CandyBar {
  foodService = inject(FoodService);

  // Mapa para guardar la cantidad seleccionada por id de producto
  seleccionados = new Map<string, number>();

  getCantidad(foodId: string): number {
    return this.seleccionados.get(foodId) || 0;
  }

  agregarProducto(food: Food) {
    const actual = this.getCantidad(food.id);
    this.seleccionados.set(food.id, actual + 1);
  }

  quitarProducto(food: Food) {
    const actual = this.getCantidad(food.id);
    if (actual > 1) {
      this.seleccionados.set(food.id, actual - 1);
    } else {
      this.seleccionados.delete(food.id);
    }
  }
}
