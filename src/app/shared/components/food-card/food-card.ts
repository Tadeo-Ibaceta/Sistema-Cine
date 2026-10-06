import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Food } from '../../../core/models/food.interface';

@Component({
  imports: [],
  selector: 'app-food-card',
  styleUrl: './food-card.css',
  templateUrl: './food-card.html',
})
export class FoodCard {
  @Input({ required: true }) food!: Food;
  @Input() cantidad: number = 0;

  @Output() agregar = new EventEmitter<Food>();
  @Output() quitar = new EventEmitter<Food>();

  onAgregar() {
    this.agregar.emit(this.food);
  }

  onQuitar() {
    this.quitar.emit(this.food);
  }
}
