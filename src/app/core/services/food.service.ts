import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Food } from '../models/food.interface';
import { SupabaseService } from './supabase.service';

@Service()
export class FoodService {
  // inject() — inyectamos el cliente de Supabase
    private supabase = inject(SupabaseService).client;
    private destroyRef = inject(DestroyRef);

  // signal() privado — solo el servicio puede modificar la lista directamente
    private foodsSignal = signal<Food[]>([]);

  // signal() para indicar si los datos están cargando
    cargando = signal(false);

  // computed() de solo lectura — los componentes leen de aquí
  // Al ser computed, se actualiza automáticamente cuando la signal cambia
    foods = computed(() => this.foodsSignal());

  // Referencia al canal de Realtime para limpieza
    private channel!: RealtimeChannel;

    constructor() {
        
        this.cargarComidasDesdeDB();
        // Nos suscribimos a cambios en tiempo real
        this.channel = this.iniciarRealtime();

        // Limpiamos la suscripción cuando el servicio se destruye
        this.destroyRef.onDestroy(() => {
            this.supabase.removeChannel(this.channel);
        });
    }

  // ============================================================
  // CARGAR COMIDAS DESDE SUPABASE
  // ============================================================
    private async cargarComidasDesdeDB(): Promise<void> {
        this.cargando.set(true);

        const { data, error } = await this.supabase
            .from('Food')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) {
            console.error('❌ Error al cargar las comidas desde Supabase:', error.message);
        } else {
            this.foodsSignal.set(data || []);
            console.log(`✅ Se cargaron ${data?.length ?? 0} comidas desde Supabase`);
        }

        this.cargando.set(false);
    }

    private iniciarRealtime(): RealtimeChannel {
    return this.supabase
        .channel('foods-realtime')
        .on('postgres_changes',
        { event: '*', schema: 'public', table: 'Food' },
        (payload) => {
            console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);

            switch (payload.eventType) {
            // INSERT
            case 'INSERT':
                this.foodsSignal.update(foods => [...foods, payload.new as Food]);
                break;

            // UPDATE 
            case 'UPDATE':
                this.foodsSignal.update(foods =>
                foods.map(f => f.id === (payload.new as Food).id
                    ? payload.new as Food
                    : f
                )
                );
                break;

            // DELETE
            case 'DELETE':
                this.foodsSignal.update(foods =>
                foods.filter(f => f.id !== (payload.old as { id: string }).id)
                );
                break;
            }
        }
        )
        .subscribe();
    }

    getFoodById(id: string) {
        return computed(() => this.foodsSignal().find(food => food.id === id));
    }
}
