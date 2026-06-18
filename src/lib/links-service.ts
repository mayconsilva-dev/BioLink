import { supabase } from './supabase';
import { isIconName } from './icons';
import type { LinkButtonProps, LinkDraft, LinkRow } from '../types';

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase não está configurado (verifique o arquivo .env.local).');
  }
  return supabase;
}

/** Busca os links visíveis de um usuário para a página pública, já ordenados. */
export async function fetchPublicLinksByUser(
  userId: string,
): Promise<LinkButtonProps[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('links')
    .select('title, url, icon, highlighted, position, created_at')
    .eq('user_id', userId)
    .eq('visible', true)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    title: row.title,
    url: row.url,
    icon: isIconName(row.icon) ? row.icon : 'Link',
    highlighted: row.highlighted,
  }));
}

/** Busca todos os links do dono autenticado (inclusive ocultos). */
export async function fetchOwnerLinks(userId: string): Promise<LinkRow[]> {
  const client = requireClient();

  // Filtra explicitamente pelo dono. A RLS de leitura pública (visible = true)
  // permitiria ler os links visíveis de outros usuários sem este filtro.
  const { data, error } = await client
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as LinkRow[];
}

/** Cria um novo link na próxima posição disponível. */
export async function createLink(
  draft: LinkDraft,
  position: number,
): Promise<LinkRow> {
  const client = requireClient();

  const { data, error } = await client
    .from('links')
    .insert({ ...draft, position })
    .select()
    .single();

  if (error) throw error;
  return data as LinkRow;
}

/** Atualiza os campos de um link existente. */
export async function updateLink(
  id: string,
  patch: Partial<LinkDraft & { position: number }>,
): Promise<void> {
  const client = requireClient();

  const { error } = await client.from('links').update(patch).eq('id', id);
  if (error) throw error;
}

/** Exclui um link. */
export async function deleteLink(id: string): Promise<void> {
  const client = requireClient();

  const { error } = await client.from('links').delete().eq('id', id);
  if (error) throw error;
}

/** Persiste a ordem (campo position) de uma lista de links. */
export async function persistOrder(ids: string[]): Promise<void> {
  const client = requireClient();

  await Promise.all(
    ids.map((id, index) =>
      client.from('links').update({ position: index }).eq('id', id),
    ),
  );
}
