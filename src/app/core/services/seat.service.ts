import { inject, Service } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Service()
export class SeatService {
    private realtimeChannel!: RealtimeChannel;
    // 1. PRIVADA y MODIFICABLE (solo el servicio puede cambiar los datos)
    private ocupadasSubject = new BehaviorSubject<string[]>([]);
    // 2. PÚBLICA y DE SOLO LECTURA (los componentes solo pueden "escuchar")
    public ocupadas$ = this.ocupadasSubject.asObservable();

    private supabase = inject(SupabaseService).client;

    // Suscribirse a cambios de butacas ocupadas para una función específica
    suscribirAButacasFuncion(funcionId: string) {
        // 1. Cargar estado inicial
        this.cargarButacasOcupadas(funcionId);

        // 2. Escuchar cambios en tiempo real
        this.realtimeChannel = this.supabase
        .channel(`funcion-${funcionId}`)
        .on(
            'postgres_changes',
            {
            event: '*',
            schema: 'public',
            table: 'reservas',
            filter: `funcion_id=eq.${funcionId}`
            },
            (payload) => {
            // Re-cargar o actualizar lista de ocupadas cuando alguien reserve
            this.cargarButacasOcupadas(funcionId);
            }
        )
        .subscribe();
    }

    desconectarRealtime() {
        if (this.realtimeChannel) {
            this.supabase.removeChannel(this.realtimeChannel);
        }
    }

    private async cargarButacasOcupadas(funcionId: string) {
        const { data, error } = await this.supabase
        .from('reservas')
        .select('butaca_id')
        .eq('funcion_id', funcionId);

        if (!error && data) {
            const ids = data.map((item: any) => item.butaca_id);
            this.ocupadasSubject.next(ids);
        }
    }
}