import { supabase } from './supabase';
import type { ProfileDraft, ProfileRow } from '../types';

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase não está configurado (verifique o arquivo .env.local).');
  }
  return supabase;
}

/** Busca o perfil público de um usuário pelo @handle (case-insensitive). */
export async function fetchPublicProfileByHandle(
  handle: string,
): Promise<ProfileRow | null> {
  if (!supabase) return null;

  // Handles são sempre armazenados em minúsculas; comparação exata evita os
  // curingas do `ilike` (o underscore é um caractere válido de handle).
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle.toLowerCase())
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRow) ?? null;
}

/** Busca o perfil do dono autenticado (ou null se ainda não foi criado). */
export async function fetchOwnerProfile(userId: string): Promise<ProfileRow | null> {
  const client = requireClient();

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRow) ?? null;
}

/** Cria ou atualiza o perfil do dono autenticado. */
export async function upsertProfile(
  userId: string,
  draft: ProfileDraft,
): Promise<void> {
  const client = requireClient();

  const { error } = await client.from('profiles').upsert({
    user_id: userId,
    ...draft,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

const AVATAR_BUCKET = 'avatars';

/**
 * Envia a foto de perfil para o Storage (bucket `avatars`) na pasta do dono
 * e devolve a URL pública (com cache-busting). Sobrescreve a foto anterior.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const client = requireClient();

  // Caminho fixo por usuário: cada novo upload substitui o anterior.
  const path = `${userId}/avatar`;

  const { error } = await client.storage.from(AVATAR_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
  });
  if (error) throw error;

  const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  // Query param força o navegador a recarregar a imagem após a troca.
  return `${data.publicUrl}?t=${Date.now()}`;
}
