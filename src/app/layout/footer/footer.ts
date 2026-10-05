import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  // Interpolación simple — el año actual
  anioActual = new Date().getFullYear();
}
