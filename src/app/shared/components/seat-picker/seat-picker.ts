import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Butaca, TipoButaca } from '../../../core/models/butaca.interface';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-seat-picker',
  styleUrl: './seat-picker.css',
  templateUrl: './seat-picker.html',
})
export class SeatPicker {
  @Input() ocupadasIds: string[] = []; // IDs de butacas ya compradas para esta función
  @Input() precioBase: number = 5000;
  @Input() precioVip: number = 7500;
  
  @Output() seleccionCambiada = new EventEmitter<{ butacas: Butaca[]; total: number }>();

  filasLetras: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
  mapaFilas: { letra: string; bloques: { bloque1: Butaca[]; bloque2: Butaca[]; bloque3: Butaca[] } }[] = [];
  
  butacasSeleccionadas: Butaca[] = [];

  ngOnInit(): void {
    this.generarMapaSalas();
  }

  generarMapaSalas() {
    this.mapaFilas = this.filasLetras.map((letra) => {
      const esDiscapacidad = letra === 'J' || letra === 'K';
      const esVip = letra === 'R' || letra === 'S' || letra === 'T';

      const cant1 = esDiscapacidad ? 2 : 4;
      const cant2 = esDiscapacidad ? 10 : 20;
      const cant3 = esDiscapacidad ? 2 : 4;

      const tipo: TipoButaca = esDiscapacidad ? 'discapacidad' : esVip ? 'vip' : 'comun';
      const precio = esVip ? this.precioVip : this.precioBase;

      let numCount = 1;

      const crearBloque = (cant: number, colBloque: 1 | 2 | 3): Butaca[] => {
        const bloque: Butaca[] = [];
        for (let i = 0; i < cant; i++) {
          const id = `${letra}${numCount}`;
          const estaOcupada = this.ocupadasIds.includes(id);
          bloque.push({
            id,
            fila: letra,
            numero: numCount++,
            columnaBloque: colBloque,
            tipo,
            precio,
            estado: estaOcupada ? 'ocupada' : 'libre'
          });
        }
        return bloque;
      };

      return {
        letra,
        bloques: {
          bloque1: crearBloque(cant1, 1),
          bloque2: crearBloque(cant2, 2),
          bloque3: crearBloque(cant3, 3)
        }
      };
    });
  }

  toggleButaca(butaca: Butaca) {
    if (butaca.estado === 'ocupada') return;

    if (butaca.estado === 'seleccionada') {
      butaca.estado = 'libre';
      this.butacasSeleccionadas = this.butacasSeleccionadas.filter(b => b.id !== butaca.id);
    } else {
      butaca.estado = 'seleccionada';
      this.butacasSeleccionadas.push(butaca);
    }

    const total = this.butacasSeleccionadas.reduce((sum, b) => sum + b.precio, 0);
    this.seleccionCambiada.emit({ butacas: this.butacasSeleccionadas, total });
  }
}
