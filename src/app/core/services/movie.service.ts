import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Movie } from '../models/movie.interface';

@Service()
export class MovieService {
  // inject() — inyectamos el cliente de Supabase
    private supabase = inject(SupabaseService).client;
    private destroyRef = inject(DestroyRef);

  // signal() privado — solo el servicio puede modificar la lista directamente
    private moviesSignal = signal<Movie[]>([]);

  // signal() para indicar si los datos están cargando
    cargando = signal(false);

  // computed() de solo lectura — los componentes leen de aquí
  // Al ser computed, se actualiza automáticamente cuando la signal cambia
    movies = computed(() => this.moviesSignal());

  // Referencia al canal de Realtime para limpieza
    private channel!: RealtimeChannel;

    constructor() {
        
        this.cargarPeliculasDesdeDB();
        // Nos suscribimos a cambios en tiempo real
        this.channel = this.iniciarRealtime();

        // Limpiamos la suscripción cuando el servicio se destruye
        this.destroyRef.onDestroy(() => {
            this.supabase.removeChannel(this.channel);
        });
    }

  // ============================================================
  // CARGAR PELICULAS DESDE SUPABASE
  // ============================================================
    private async cargarPeliculasDesdeDB(): Promise<void> {
        this.cargando.set(true);

        const { data, error } = await this.supabase
            .from('Movie')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) {
            console.error('❌ Error al cargar las peliculas desde Supabase:', error.message);
        } else {
            this.moviesSignal.set(data || []);
            console.log(`✅ Se cargaron ${data?.length ?? 0} peliculas desde Supabase`);
        }

        this.cargando.set(false);
    }

    private iniciarRealtime(): RealtimeChannel {
    return this.supabase
        .channel('movies-realtime')
        .on('postgres_changes',
        { event: '*', schema: 'public', table: 'Movie' },
        (payload) => {
            console.log('🔄 Cambio en tiempo real:', payload.eventType, payload);

            switch (payload.eventType) {
            // INSERT
            case 'INSERT':
                this.moviesSignal.update(movies => [...movies, payload.new as Movie]);
                break;

            // UPDATE 
            case 'UPDATE':
                this.moviesSignal.update(movies =>
                movies.map(m => m.id === (payload.new as Movie).id
                    ? payload.new as Movie
                    : m
                )
                );
                break;

            // DELETE
            case 'DELETE':
                this.moviesSignal.update(movies =>
                movies.filter(m => m.id !== (payload.old as { id: string }).id)
                );
                break;
            }
        }
        )
        .subscribe();
    }

    getMovieById(id: string) {
        return computed(() => this.moviesSignal().find(movie => movie.id === id));
    }
}
