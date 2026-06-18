import type { LucideIcon } from 'lucide-react';

/** Lucide icon names used in this project — extend as needed in config */
export type LucideIconName =
  | 'Globe'
  | 'Link'
  | 'MessageCircle'
  | 'ShoppingBag'
  | 'BookOpen'
  | 'Mail'
  | 'Instagram'
  | 'Youtube'
  | 'Twitter'
  | 'Github'
  | 'Linkedin'
  | 'Facebook'
  | 'Music'
  | 'Video'
  | 'Phone';

export interface Profile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIconName;
  highlighted?: boolean;
}

/** Linha da tabela `links` no Supabase. */
export interface LinkRow {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  highlighted: boolean;
  visible: boolean;
  position: number;
  created_at: string;
}

/** Linha da tabela `profiles` no Supabase. */
export interface ProfileRow {
  user_id: string;
  name: string;
  handle: string;
  bio: string;
  avatar_url: string;
  updated_at: string;
}

/** Campos editáveis do perfil no painel de admin. */
export interface ProfileDraft {
  name: string;
  handle: string;
  bio: string;
  avatar_url: string;
}

/** Campos editáveis de um link no painel de admin. */
export interface LinkDraft {
  title: string;
  url: string;
  icon: LucideIconName;
  highlighted: boolean;
  visible: boolean;
}

export interface SocialLink {
  id: string;
  url: string;
  icon: LucideIconName;
  label: string;
}

export interface Theme {
  primary: string;
  primaryForeground: string;
  background: string;
  surface: string;
  surfaceHover?: string;
  text: string;
  textMuted: string;
  border?: string;
}

export interface Meta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  locale?: string;
}

export interface SiteConfig {
  profile: Profile;
  links: LinkItem[];
  socials: SocialLink[];
  theme: Theme;
  meta: Meta;
}

export interface ProfileCardProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  avatarAlt: string;
}

export interface LinkButtonProps {
  title: string;
  url: string;
  icon: LucideIconName;
  highlighted?: boolean;
}

export interface LinkListProps {
  links: LinkButtonProps[];
  emptyMessage?: string;
}

export interface SocialIconsProps {
  socials: SocialLink[];
}

export interface SeoHeadProps {
  meta: Meta;
  profile: Pick<Profile, 'name' | 'avatarUrl'>;
  socialUrls: string[];
}

export type { LucideIcon };
