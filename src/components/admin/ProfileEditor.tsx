import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { getInitials } from '../../lib/config-utils';
import { normalizeHandle, validateHandle } from '../../lib/handles';
import type { ProfileDraft } from '../../types';

interface ProfileEditorProps {
  profile: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
  /** Faz upload do arquivo de foto e atualiza/salva a URL do avatar. */
  onAvatarUpload: (file: File) => Promise<void>;
  /** Erro do @handle vindo do servidor (ex.: já em uso). */
  handleError?: string | null;
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Seção de edição do perfil (foto, nome, @handle e bio) no painel de admin.
 * A foto é enviada por upload — no celular o usuário pode tirar uma foto na
 * hora ou escolher da galeria (input de arquivo de imagem, sem `capture` fixo).
 */
export function ProfileEditor({
  profile,
  onChange,
  onAvatarUpload,
  handleError,
}: ProfileEditorProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const inputClasses =
    'w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary';
  const labelClasses = 'text-xs font-medium text-text-muted';

  const showAvatar = profile.avatar_url.trim() !== '' && !avatarError;
  const localHandleError = validateHandle(profile.handle);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Permite reescolher o mesmo arquivo depois (reseta o valor do input).
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setUploadError('A imagem é muito grande (máx. 5 MB).');
      return;
    }

    setUploadError(null);
    setAvatarError(false);
    setUploading(true);
    try {
      await onAvatarUpload(file);
    } catch (error) {
      console.error(error);
      setUploadError('Não foi possível enviar a foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">Perfil</h2>

      <div className="flex items-center gap-4">
        {/* Avatar clicável: abre câmera/galeria */}
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          aria-label="Alterar foto de perfil"
          className="group relative shrink-0 rounded-full"
          style={{ width: 64, height: 64 }}
        >
          {showAvatar ? (
            <img
              src={profile.avatar_url}
              alt="Foto de perfil"
              width={64}
              height={64}
              onError={() => setAvatarError(true)}
              className="h-16 w-16 rounded-full object-cover"
              style={{ border: '2px solid var(--color-border)' }}
            />
          ) : (
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-bg text-base font-semibold text-text"
              style={{ border: '2px solid var(--color-border)' }}
              aria-hidden="true"
            >
              {getInitials(profile.name) || '?'}
            </span>
          )}
          {/* Sobreposição com ícone (câmera ou spinner) */}
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" style={{ opacity: uploading ? 1 : undefined }}>
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Camera size={20} />
            )}
          </span>
        </button>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex w-fit items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            <Camera size={15} aria-hidden="true" />
            {uploading ? 'Enviando…' : 'Tirar foto ou escolher da galeria'}
          </button>
          <span className="text-xs text-text-muted">JPG, PNG ou WEBP · até 5 MB</span>
        </div>

        {/* Sem atributo `capture`: no celular o sistema oferece câmera OU galeria. */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {uploadError && (
        <p className="text-xs" style={{ color: 'var(--color-error)' }}>
          {uploadError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1">
          <span className={labelClasses}>Nome</span>
          <input
            aria-label="Nome do perfil"
            placeholder="Seu nome"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className={labelClasses}>@handle</span>
          <input
            aria-label="Handle do perfil"
            placeholder="seuusuario"
            value={profile.handle}
            onChange={(e) =>
              onChange({ handle: normalizeHandle(e.target.value) })
            }
            className={inputClasses}
          />
        </label>
      </div>

      {/* URL pública / erros do @handle */}
      {handleError ? (
        <p className="text-xs" style={{ color: 'var(--color-error)' }}>
          {handleError}
        </p>
      ) : localHandleError ? (
        <p className="text-xs" style={{ color: 'var(--color-error)' }}>
          {localHandleError}
        </p>
      ) : (
        <p className="text-xs text-text-muted">
          Sua página: <span className="text-text">#/{profile.handle}</span>
        </p>
      )}

      <label className="flex flex-col gap-1">
        <span className={labelClasses}>Bio</span>
        <textarea
          aria-label="Bio do perfil"
          placeholder="Conte um pouco sobre você"
          value={profile.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={3}
          className={`${inputClasses} resize-y`}
        />
      </label>
    </section>
  );
}
