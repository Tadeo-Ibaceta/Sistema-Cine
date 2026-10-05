import { Component } from '@angular/core';
import { FoodCard } from '../../shared/components/food-card/food-card';

@Component({
  imports: [FoodCard],
  selector: 'app-candy-bar',
  styleUrl: './candy-bar.css',
  templateUrl: './candy-bar.html',
})
export class CandyBar {}
