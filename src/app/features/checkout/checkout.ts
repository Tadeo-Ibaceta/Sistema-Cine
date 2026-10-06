// import { Component, inject } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Butaca } from '../../core/models/butaca.interface';
// import { Food } from '../../core/models/food.interface';
// import { Funcion } from '../../core/models/funcion.interface';
// import { Movie } from '../../core/models/movie.interface';
// import { AuthService } from '../../core/services/auth.service';
// import { SeatService } from '../../core/services/seat.service';
// import { FoodService } from '../../core/services/food.service';
// import { MovieService } from '../../core/services/movie.service';

// @Component({
//   imports: [],
//   selector: 'app-checkout',
//   styleUrl: './checkout.css',
//   templateUrl: './checkout.html',
// })
// export class Checkout {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private movieService = inject(MovieService);
//   private authService = inject(AuthService);
//   private foodService = inject(FoodService);
//   private seatService = inject(SeatService);

//   // Datos principales
//   funcionId!: string;
//   funcion?: Funcion;
//   pelicula?: Movie;
//   butacasOcupadas: string[] = [];
  
//   // Selección del usuario
//   butacasSeleccionadas: Butaca[] = [];
//   subtotalEntradas: number = 0;
  
//   // Candy Bar
//   productosCandy: Food[] = [];
//   itemsCandySeleccionados: ItemCandyBar[] = [];
  
//   // Usuario y Restricción de Edad
//   usuarioLogueado: any = null;
//   esMenorDeEdad: boolean = false;
//   requiereAcompananteAdulto: boolean = false;
//   emailAnonimo: string = '';

//   // Cupones y Descuentos
//   codigoCupon: string = '';
//   descuentoPorcentaje: number = 0;
//   mensajeCupon: string = '';
//   esPrimeraCompra: boolean = false;

//   // Crédito de Usuario acumulado
//   creditoDisponible: number = 0;
//   usarCredito: boolean = false;

//   ngOnInit(): void {
//     this.funcionId = this.route.snapshot.paramMap.get('funcionId') || '';
//     this.cargarDatos();
//   }

//   async cargarDatos() {
//     this.usuarioLogueado = this.authService.currentUser; 
    
//     // Suscribirse a las butacas ocupadas en tiempo real para esta función
//     if (this.funcionId) {
//       this.seatService.suscribirAButacasFuncion(this.funcionId);
//       this.seatService.ocupadas$.subscribe((ids) => {
//         this.butacasOcupadas = ids;
//       });
//     }

//     // Cargar productos del Candy Bar
//     this.foodService.getFoodItems().subscribe((items) => {
//       this.productosCandy = items;
//     });

//     // Validar edad del usuario registrado
//     if (this.usuarioLogueado) {
//       this.validarEdadYBeneficios();
//     }
//   }

//   validarEdadYBeneficios() {
//     // Cálculo de edad
//     if (this.usuarioLogueado?.fechaNacimiento) {
//       const fechaNac = new Date(this.usuarioLogueado.fechaNacimiento);
//       const edad = new Date().getFullYear() - fechaNac.getFullYear();
      
//       // Restricción por clasificación de película (ej: R18 o R13)
//       if (this.pelicula?.clasificacion === '18' && edad < 18) {
//         this.esMenorDeEdad = true;
//         this.requiereAcompananteAdulto = true;
//       } else if (this.pelicula?.clasificacion === '13' && edad < 13) {
//         this.esMenorDeEdad = true;
//         this.requiereAcompananteAdulto = true;
//       }
//     }

//     // Verificar si es su primera compra para cupón automático del 20%
//     if (this.usuarioLogueado?.esPrimeraCompra) {
//       this.esPrimeraCompra = true;
//       this.descuentoPorcentaje = 20;
//       this.mensajeCupon = '¡Se aplicó un 20% de descuento por tu primera compra!';
//     }

//     // Saldo en crédito previo por cancelaciones
//     this.creditoDisponible = this.usuarioLogueado?.creditoSaldo || 0;
//   }

//   onSeleccionButacasCambiada(evento: { butacas: Butaca[]; total: number }) {
//     this.butacasSeleccionadas = evento.butacas;
//     this.subtotalEntradas = evento.total;
//   }

//   // Manejo de Candy Bar
//   agregarCandy(food: Food) {
//     const existe = this.itemsCandySeleccionados.find(i => i.item.id === food.id);
//     if (existe) {
//       existe.cantidad++;
//     } else {
//       this.itemsCandySeleccionados.push({ item: food, cantidad: 1 });
//     }
//   }

//   quitarCandy(foodId: string) {
//     const indice = this.itemsCandySeleccionados.findIndex(i => i.item.id === foodId);
//     if (indice !== -1) {
//       if (this.itemsCandySeleccionados[indice].cantidad > 1) {
//         this.itemsCandySeleccionados[indice].cantidad--;
//       } else {
//         this.itemsCandySeleccionados.splice(indice, 1);
//       }
//     }
//   }

//   // Aplicación de Cupones Manuales
//   aplicarCuponManual() {
//     const codigo = this.codigoCupon.toUpperCase().trim();
//     if (codigo === 'MAYO50') {
//       // Validar si el usuario tiene más de 50 años
//       const edad = this.calcularEdad(this.usuarioLogueado?.fechaNacimiento);
//       if (edad >= 50) {
//         this.descuentoPorcentaje = 30;
//         this.mensajeCupon = 'Cupón +50 aplicado con éxito (30% OFF).';
//       } else {
//         this.mensajeCupon = 'Este cupón es exclusivo para mayores de 50 años.';
//       }
//     } else {
//       this.mensajeCupon = 'Código de cupón inválido o expirado.';
//     }
//   }

//   private calcularEdad(fechaStr?: string): number {
//     if (!fechaStr) return 0;
//     const nac = new Date(fechaStr);
//     return new Date().getFullYear() - nac.getFullYear();
//   }

//   // Cálculos de Totales
//   get subtotalCandy(): number {
//     return this.itemsCandySeleccionados.reduce((acc, curr) => acc + (curr.item.price * curr.cantidad), 0);
//   }

//   get subtotalGeneral(): number {
//     return this.subtotalEntradas + this.subtotalCandy;
//   }

//   get montoDescuento(): number {
//     return (this.subtotalGeneral * this.descuentoPorcentaje) / 100;
//   }

//   get montoCreditoAplicado(): number {
//     if (!this.usarCredito) return 0;
//     const totalConDescuento = this.subtotalGeneral - this.montoDescuento;
//     return Math.min(this.creditoDisponible, totalConDescuento);
//   }

//   get totalFinal(): number {
//     return Math.max(0, this.subtotalGeneral - this.montoDescuento - this.montoCreditoAplicado);
//   }

//   get puntosAProcesar(): number {
//     // Requerimiento: 1 peso gastado = 1 punto acumulado
//     return Math.floor(this.totalFinal);
//   }

//   async confirmarCompra() {
//     if (this.butacasSeleccionadas.length === 0) {
//       alert('Debes seleccionar al menos una butaca para continuar.');
//       return;
//     }

//     if (!this.usuarioLogueado && !this.emailAnonimo) {
//       alert('Por favor, ingresa tu correo electrónico para enviarte las entradas.');
//       return;
//     }

//     const payloadReserva = {
//       funcionId: this.funcionId,
//       usuarioId: this.usuarioLogueado?.id || null,
//       emailComprador: this.usuarioLogueado?.email || this.emailAnonimo,
//       butacas: this.butacasSeleccionadas,
//       candyItems: this.itemsCandySeleccionados,
//       subtotal: this.subtotalGeneral,
//       descuento: this.montoDescuento,
//       creditoUsado: this.montoCreditoAplicado,
//       totalPagado: this.totalFinal,
//       puntosGanados: this.usuarioLogueado ? this.puntosAProcesar : 0
//     };

//     try {
//       // Guardar reserva en Supabase
//       const reservaCreada = await this.bookingService.crearReserva(payloadReserva);
      
//       // Redirigir a la pantalla de Confirmación / Generación de PDF y QR
//       this.router.navigate(['/reserva-confirmada', reservaCreada.id]);
//     } catch (error) {
//       console.error('Error al procesar la reserva:', error);
//       alert('Ocurrió un error al procesar tu compra. Por favor reintenta.');
//     }
//   }
// }
