import { importProvidersFrom, Service } from '@angular/core';
import { environment } from '../../../environments/environments';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Service()
export class SupabaseService {
    private supabase : SupabaseClient;


    constructor() {
    this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.publicKey
    );
    }

  // Permite a otros servicios acceder al cliente configurado
    get client(): SupabaseClient {
    return this.supabase;
    }
}
