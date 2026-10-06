export interface Funcion {
    id: string;
    movieId: string;
    salaId: string;
    fechaHoraInicio: string; 
    fechaHoraFin: string;    // Duración película + 30 min 
    formato: '2D' | '3D' | '4D' | 'IMAX';
    idioma: 'Castellano' | 'Subtitulada';
    precioBase: number;
    precioVip: number;
}
