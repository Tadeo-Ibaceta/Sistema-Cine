import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-search-bar',
  styleUrl: './search-bar.css',
  templateUrl: './search-bar.html',
})
export class SearchBar {
    // model() — permite two-way binding entre padre e hijo
  // El padre puede usar [(termino)]="suSignal" para sincronizar el valor
  termino = model<string>('');

  limpiar(): void {
    this.termino.set('');
  }

}
