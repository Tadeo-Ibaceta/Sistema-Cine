import { Component } from '@angular/core';
import { Food } from '../../../core/models/food.interface';

@Component({
  imports: [],
  selector: 'app-food-card',
  styleUrl: './food-card.css',
  templateUrl: './food-card.html',
})
export class FoodCard {
  food: Food = {
    id: '1',
    imagenUrl: 'https://www.abc.com.py/resizer/v2/LNSOAWOFEFA7NAKVUWBAKTQEWQ.jpg?auth=2de0e8091cfde9cc0b28bd6b02b9b73a1980aa67fe9cc29c43c5041c59144dc0&width=400&smart=true',
    nombre: 'Super Pancho',
    precio: 6000,
    disponible: true
  };

  mostrarAlerta(){
    alert("Boton apretado");
  }
}
