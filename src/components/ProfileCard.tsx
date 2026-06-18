import { useEffect, useState } from 'react';
import type { ProfileCardProps } from '../types';
import { formatHandle, getInitials } from '../lib/config-utils';
import defaultAvatar from '../assets/avatar.jpg';

export function ProfileCard({
  name,
  handle,
  bio,
  avatarUrl,
  avatarAlt,
}: ProfileCardProps) {
  const [imgSrc, setImgSrc] = useState(avatarUrl);
  const [showFallback, setShowFallback] = useState(false);

  // O perfil pode chegar de forma assíncrona (Supabase): reseta a imagem
  // sempre que a URL muda, para refletir o avatar atualizado.
  useEffect(() => {
    setImgSrc(avatarUrl);
    setShowFallback(false);
  }, [avatarUrl]);

  const handleImageError = () => {
    if (imgSrc !== defaultAvatar) {
      setImgSrc(defaultAvatar);
      return;
    }
    setShowFallback(true);
  };

  return (
    <header className="flex w-full flex-col items-center text-center">
      {showFallback ? (
        <div
          className="flex items-center justify-center rounded-full bg-surface text-lg font-semibold text-text"
          style={{
            width: 'var(--avatar-size)',
            height: 'var(--avatar-size)',
            border: '2px solid var(--color-border)',
          }}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={avatarAlt}
          width={96}
          height={96}
          onError={handleImageError}
          className="rounded-full object-cover"
          style={{
            width: 'var(--avatar-size)',
            height: 'var(--avatar-size)',
            border: '2px solid var(--color-border)',
          }}
        />
      )}
      <h1 className="mt-4 text-lg font-semibold leading-tight text-text">
        {name}
      </h1>
      <p className="mt-1 text-sm text-text-muted">{formatHandle(handle)}</p>
      <p className="mt-3 line-clamp-3 max-w-full text-sm leading-normal text-text-muted">
        {bio}
      </p>
    </header>
  );
}
