import { useCallback, useEffect, useRef, useState } from 'react';
import { LogOut, Plus, ExternalLink } from 'lucide-react';
import { useAuth, signOut } from '../../hooks/useAuth';
import {
  createLink,
  deleteLink,
  fetchOwnerLinks,
  persistOrder,
  updateLink,
} from '../../lib/links-service';
import {
  fetchOwnerProfile,
  uploadAvatar,
  upsertProfile,
} from '../../lib/profile-service';
import { isSupabaseConfigured } from '../../lib/supabase';
import { validateHandle } from '../../lib/handles';
import type { LinkRow, ProfileDraft } from '../../types';
import { LoginForm } from './LoginForm';
import { LinkEditorRow } from './LinkEditorRow';
import { ProfileEditor } from './ProfileEditor';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Detecta erro de @handle duplicado (índice único do Postgres). */
function isDuplicateHandle(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  const message = error instanceof Error ? error.message : String(error);
  return code === '23505' || /duplicate|profiles_handle_unique/i.test(message);
}

const EMPTY_PROFILE: ProfileDraft = {
  name: '',
  handle: '',
  bio: '',
  avatar_url: '',
};

const EDITABLE_FIELDS: (keyof LinkRow)[] = [
  'title',
  'url',
  'icon',
  'highlighted',
  'visible',
];

export function AdminPage() {
  const { session, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [profile, setProfile] = useState<ProfileDraft>(EMPTY_PROFILE);
  const [handleError, setHandleError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');

  const dirtyIds = useRef<Set<string>>(new Set());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Espelha o estado mais recente para o flush ler sem recriar callbacks.
  const linksRef = useRef<LinkRow[]>([]);
  linksRef.current = links;

  // Salvamento do perfil (debounce próprio, espelhado em refs para o flush).
  const profileRef = useRef<ProfileDraft>(EMPTY_PROFILE);
  profileRef.current = profile;
  const profileDirty = useRef(false);
  const profileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loggedIn = Boolean(session);
  const userId = session?.user.id;

  useEffect(() => {
    if (!loggedIn || !userId) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([fetchOwnerLinks(userId), fetchOwnerProfile(userId)])
      .then(([rows, profileRow]) => {
        if (!active) return;
        setLinks(rows);
        // O perfil é criado automaticamente no cadastro (trigger no banco).
        // O fallback vazio só cobre algum caso raro de perfil ausente.
        setProfile(
          profileRow
            ? {
                name: profileRow.name,
                handle: profileRow.handle,
                bio: profileRow.bio,
                avatar_url: profileRow.avatar_url,
              }
            : EMPTY_PROFILE,
        );
      })
      .catch((error) => {
        console.error(error);
        if (active) setStatus('error');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [loggedIn, userId]);

  const flush = useCallback(async () => {
    const ids = Array.from(dirtyIds.current);
    if (ids.length === 0) return;
    dirtyIds.current = new Set();
    setStatus('saving');
    try {
      await Promise.all(
        ids.map((id) => {
          const row = linksRef.current.find((l) => l.id === id);
          if (!row) return Promise.resolve();
          const patch = Object.fromEntries(
            EDITABLE_FIELDS.map((f) => [f, row[f]]),
          );
          return updateLink(id, patch);
        }),
      );
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, 700);
  }, [flush]);

  const flushProfile = useCallback(async () => {
    if (!profileDirty.current || !userId) return;

    // O @handle vira a URL pública: precisa ser válido e único.
    const validationError = validateHandle(profileRef.current.handle);
    if (validationError) {
      setHandleError(validationError);
      setStatus('idle');
      return; // não limpa o "dirty": tenta de novo quando o usuário corrigir
    }

    profileDirty.current = false;
    setStatus('saving');
    try {
      await upsertProfile(userId, profileRef.current);
      setHandleError(null);
      setStatus('saved');
    } catch (error) {
      console.error(error);
      if (isDuplicateHandle(error)) {
        setHandleError('Esse @handle já está em uso. Escolha outro.');
      }
      setStatus('error');
    }
  }, [userId]);

  const handleProfileChange = useCallback(
    (patch: Partial<ProfileDraft>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
      profileDirty.current = true;
      setStatus('idle');
      if ('handle' in patch) setHandleError(null);
      if (profileTimer.current) clearTimeout(profileTimer.current);
      profileTimer.current = setTimeout(flushProfile, 700);
    },
    [flushProfile],
  );

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!userId) return;
      setStatus('saving');
      const url = await uploadAvatar(userId, file);
      // Persiste a nova foto imediatamente (sem esperar o debounce).
      const next = { ...profileRef.current, avatar_url: url };
      setProfile(next);
      try {
        await upsertProfile(userId, next);
        profileDirty.current = false;
        setStatus('saved');
      } catch (error) {
        console.error(error);
        setStatus('error');
        throw error;
      }
    },
    [userId],
  );

  const handleChange = useCallback(
    (id: string, patch: Partial<LinkRow>) => {
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      );
      dirtyIds.current.add(id);
      setStatus('idle');
      scheduleFlush();
    },
    [scheduleFlush],
  );

  const handleDelete = useCallback(async (id: string) => {
    const snapshot = linksRef.current;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setStatus('saving');
    try {
      await deleteLink(id);
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setLinks(snapshot); // desfaz em caso de erro
      setStatus('error');
    }
  }, []);

  const handleMove = useCallback(async (id: string, direction: -1 | 1) => {
    const current = linksRef.current;
    const index = current.findIndex((l) => l.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return;

    const reordered = [...current];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    const normalized = reordered.map((l, i) => ({ ...l, position: i }));
    setLinks(normalized);
    setStatus('saving');
    try {
      await persistOrder(normalized.map((l) => l.id));
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  const handleAdd = useCallback(async () => {
    setStatus('saving');
    try {
      const created = await createLink(
        {
          title: 'Novo link',
          url: 'https://',
          icon: 'Link',
          highlighted: false,
          visible: true,
        },
        linksRef.current.length,
      );
      setLinks((prev) => [...prev, created]);
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  // Salva pendências ao desmontar / fechar a aba.
  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      if (profileTimer.current) clearTimeout(profileTimer.current);
      void flush();
      void flushProfile();
    };
  }, [flush, flushProfile]);

  const container =
    'mx-auto flex min-h-dvh w-full max-w-[var(--page-max-width)] flex-col gap-6 px-[var(--page-padding-x)] py-8';

  if (!isSupabaseConfigured) {
    return (
      <main className={container}>
        <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6 text-center text-sm text-text-muted">
          <p className="mb-2 text-base font-semibold text-text">
            Supabase não configurado
          </p>
          Copie <code>.env.example</code> para <code>.env.local</code>, preencha
          as credenciais do seu projeto Supabase e rode <code>supabase/schema.sql</code>{' '}
          no SQL Editor. Depois reinicie o servidor de desenvolvimento.
        </div>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main className={container}>
        <p className="text-center text-sm text-text-muted">Carregando…</p>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className={`${container} justify-center`}>
        <LoginForm />
        <a
          href="#/"
          className="text-center text-sm text-text-muted underline-offset-4 hover:underline"
        >
          ← Voltar para a página
        </a>
      </main>
    );
  }

  const statusLabel: Record<SaveStatus, string> = {
    idle: '',
    saving: 'Salvando…',
    saved: 'Tudo salvo',
    error: 'Erro ao salvar',
  };

  return (
    <main className={container}>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text">Meus links</h1>
          <p className="text-xs text-text-muted">{session?.user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {profile.handle.trim() !== '' && (
            <a
              href={`#/${profile.handle}`}
              title="Ver página pública"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
            >
              <ExternalLink size={16} /> Ver
            </a>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {!loading && (
        <ProfileEditor
          profile={profile}
          onChange={handleProfileChange}
          onAvatarUpload={handleAvatarUpload}
          handleError={handleError}
        />
      )}

      {!loading && (
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{
              color:
                status === 'error'
                  ? 'var(--color-error)'
                  : 'var(--color-text-muted)',
            }}
          >
            {statusLabel[status]}
          </span>
          <button
            type="button"
            onClick={() => void handleAdd()}
            className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-primary px-3 py-2 text-sm font-medium text-primary-fg transition-opacity hover:opacity-90"
          >
            <Plus size={16} /> Adicionar link
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-text-muted">Carregando links…</p>
      ) : links.length === 0 ? (
        <p className="rounded-[var(--radius-md)] border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Nenhum link adicionado.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <LinkEditorRow
              key={link.id}
              link={link}
              isFirst={i === 0}
              isLast={i === links.length - 1}
              onChange={handleChange}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      )}
    </main>
  );
}
