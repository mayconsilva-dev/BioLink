import type { SocialIconsProps } from '../types';
import { getLucideIcon } from '../lib/icons';

export function SocialIcons({ socials }: SocialIconsProps) {
  if (socials.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Redes sociais"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      {socials.map((social) => {
        const Icon = getLucideIcon(social.icon);
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center justify-center rounded-full bg-surface text-text transition-colors duration-150 hover:bg-surface-hover"
            style={{
              width: 'var(--social-icon-size)',
              height: 'var(--social-icon-size)',
            }}
          >
            <Icon size={20} aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}
