import type { LinkItem, SocialLink, Theme } from '../types';

const DEFAULT_THEME: Required<Theme> = {
  primary: '#7c3aed',
  primaryForeground: '#ffffff',
  background: '#0f0f12',
  surface: '#1a1a21',
  surfaceHover: '#24242e',
  text: '#f4f4f5',
  textMuted: '#a1a1aa',
  border: '#2e2e3a',
};

const MAX_LINK_TITLE_LENGTH = 48;

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function filterValidLinks(links: LinkItem[]): LinkItem[] {
  return links
    .filter((link) => link.title.trim() !== '' && isValidUrl(link.url))
    .map((link) => ({
      ...link,
      title: truncateTitle(link.title.trim()),
    }));
}

export function filterValidSocials(socials: SocialLink[]): SocialLink[] {
  return socials.filter(
    (social) => social.label.trim() !== '' && isValidUrl(social.url),
  );
}

export function truncateTitle(title: string): string {
  if (title.length <= MAX_LINK_TITLE_LENGTH) {
    return title;
  }
  return `${title.slice(0, MAX_LINK_TITLE_LENGTH - 1)}…`;
}

export function formatHandle(handle: string): string {
  const trimmed = handle.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export function mergeTheme(theme: Theme): Required<Theme> {
  return {
    primary: theme.primary,
    primaryForeground: theme.primaryForeground,
    background: theme.background,
    surface: theme.surface,
    surfaceHover: theme.surfaceHover ?? DEFAULT_THEME.surfaceHover,
    text: theme.text,
    textMuted: theme.textMuted,
    border: theme.border ?? DEFAULT_THEME.border,
  };
}

export function themeToCssVars(theme: Required<Theme>): Record<string, string> {
  return {
    '--color-bg': theme.background,
    '--color-surface': theme.surface,
    '--color-surface-hover': theme.surfaceHover,
    '--color-primary': theme.primary,
    '--color-primary-fg': theme.primaryForeground,
    '--color-text': theme.text,
    '--color-text-muted': theme.textMuted,
    '--color-border': theme.border,
  };
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
