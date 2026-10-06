export type TipoButaca = 'comun' | 'discapacidad' | 'vip';
export type EstadoButaca = 'libre' | 'seleccionada' | 'ocupada';

export interface Butaca {
    id: string;         
    fila: string;       // "A" hasta "T"
    numero: number;     // 1 al 28
    columnaBloque: 1 | 2 | 3; // 1 (izquierda), 2 (centro), 3 (derecha)
    tipo: TipoButaca;   // comun, discapacidad (J, K), vip (R, S, T)
    precio: number;     // Precio base o precio VIP
    estado: EstadoButaca;
}
