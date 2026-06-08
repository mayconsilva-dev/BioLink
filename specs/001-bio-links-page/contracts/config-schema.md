# Contract: Site Configuration (`src/config.ts`)

**Version**: 1.0.0 | **Feature**: `001-bio-links-page`

This contract defines the shape and rules of the sole user-editable configuration
file. Implementations MUST validate at runtime per the rules below.

## Export

```typescript
// src/config.ts
import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = { /* ... */ };
```

## Schema

```typescript
interface SiteConfig {
  profile: Profile;
  links: LinkItem[];
  socials: SocialLink[];
  theme: Theme;
  meta: Meta;
}
```

See `data-model.md` for field-level definitions.

## Owner Editing Rules

| Rule ID | Constraint |
|---------|------------|
| C-01 | Only `src/config.ts` MAY be edited for personalization |
| C-02 | `links[].id` values MUST be unique |
| C-03 | `socials[].id` values MUST be unique |
| C-04 | `links[].url` and `socials[].url` MUST use `http://` or `https://` |
| C-05 | `icon` values MUST match a `LucideIconName` literal |
| C-06 | `theme` colors MUST be valid CSS color strings |
| C-07 | Array order in `links` and `socials` defines display order |

## Example (minimal valid config)

```typescript
export const siteConfig: SiteConfig = {
  profile: {
    name: 'Maria Silva',
    handle: 'mariasilva',
    bio: 'Designer & creator. Links abaixo 👇',
    avatarUrl: '/src/assets/avatar.jpg',
  },
  links: [
    {
      id: 'portfolio',
      title: 'Meu Portfolio',
      url: 'https://example.com',
      icon: 'Globe',
      highlighted: true,
    },
  ],
  socials: [
    {
      id: 'instagram',
      url: 'https://instagram.com/mariasilva',
      icon: 'Instagram',
      label: 'Instagram de Maria Silva',
    },
  ],
  theme: {
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    background: '#0f0f12',
    surface: '#1a1a21',
    text: '#f4f4f5',
    textMuted: '#a1a1aa',
  },
  meta: {
    title: 'Maria Silva — Links',
    description: 'Todos os links de Maria Silva em um só lugar.',
    canonicalUrl: 'https://username.github.io/biolink/',
  },
};
```

## Violations & Runtime Behavior

| Violation | Behavior |
|-----------|----------|
| Invalid link URL | Entry omitted from rendered list |
| Duplicate `id` | Build warning in dev; first entry wins |
| Unknown icon name | Fallback to `Link` icon |
| Missing `socials` | Treat as empty array |
| Avatar load failure | Fallback image → initials placeholder |
