import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True quando as variáveis de ambiente do Supabase estão configuradas.
 * Quando false, a página pública usa os links estáticos de config.ts e o
 * painel de admin exibe uma mensagem de configuração.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Cliente Supabase compartilhado. É `null` quando as credenciais não estão
 * configuradas — sempre verifique `isSupabaseConfigured` antes de usar.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
