import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchPublicProfileByHandle } from '../lib/profile-service';
import { fetchPublicLinksByUser } from '../lib/links-service';
import type { LinkButtonProps, Profile } from '../types';

interface PublicPageState {
  profile: Profile | null;
  links: LinkButtonProps[];
  loading: boolean;
  notFound: boolean;
}

/**
 * Carrega a página pública de um usuário pelo @handle: primeiro o perfil, e em
 * seguida os links visíveis daquele usuário. `notFound` indica handle inexistente.
 */
export function usePublicPage(handle: string): PublicPageState {
  const [state, setState] = useState<PublicPageState>({
    profile: null,
    links: [],
    loading: true,
    notFound: false,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || handle.trim() === '') {
      setState({ profile: null, links: [], loading: false, notFound: true });
      return;
    }

    let active = true;
    setState((s) => ({ ...s, loading: true, notFound: false }));

    fetchPublicProfileByHandle(handle)
      .then(async (row) => {
        if (!active) return;
        if (!row) {
          setState({ profile: null, links: [], loading: false, notFound: true });
          return;
        }
        const links = await fetchPublicLinksByUser(row.user_id);
        if (!active) return;
        setState({
          profile: {
            name: row.name,
            handle: row.handle,
            bio: row.bio,
            avatarUrl: row.avatar_url,
          },
          links,
          loading: false,
          notFound: false,
        });
      })
      .catch((error) => {
        console.error('Falha ao carregar a página pública:', error);
        if (active) {
          setState({ profile: null, links: [], loading: false, notFound: true });
        }
      });

    return () => {
      active = false;
    };
  }, [handle]);

  return state;
}
