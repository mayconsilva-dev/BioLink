# Data Model: Página de Bio Links

**Feature**: `001-bio-links-page` | **Date**: 2026-06-05

## Overview

All entities are defined in `src/types.ts` and populated in `src/config.ts`.
No database or API — pure in-memory configuration loaded at build/runtime.

```text
SiteConfig
├── profile: Profile
├── links: LinkItem[]
├── socials: SocialLink[]
├── theme: Theme
└── meta: Meta
```

## Entities

### SiteConfig

Root configuration object exported from `src/config.ts`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `profile` | `Profile` | yes | Public identity block |
| `links` | `LinkItem[]` | yes | Ordered main navigation buttons |
| `socials` | `SocialLink[]` | no | Compact social icon row (default `[]`) |
| `theme` | `Theme` | yes | Visual customization tokens |
| `meta` | `Meta` | yes | SEO and social sharing metadata |

### Profile

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | `string` | yes | Non-empty; displayed as heading |
| `handle` | `string` | yes | Non-empty; `@` prefix added in UI if absent |
| `bio` | `string` | yes | Max ~160 chars recommended; longer text clamps |
| `avatarUrl` | `string` | yes | Valid URL or path; fallback on load error |

### LinkItem

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `id` | `string` | yes | Unique within `links` array |
| `title` | `string` | yes | Non-empty; visible button label |
| `url` | `string` | yes | Must be valid `http:` or `https:` URL; invalid entries filtered out |
| `icon` | `LucideIconName` | yes | Key from lucide icon registry |
| `highlighted` | `boolean` | no | Default `false`; uses primary theme color |

**Ordering**: Array index determines display order (no separate `order` field).

### SocialLink

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `id` | `string` | yes | Unique within `socials` |
| `url` | `string` | yes | Valid `http:` or `https:` URL |
| `icon` | `LucideIconName` | yes | Platform icon (e.g., `Instagram`, `Youtube`) |
| `label` | `string` | yes | Accessible name for `aria-label` |

### Theme

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| `primary` | `string` | yes | `--color-primary` |
| `primaryForeground` | `string` | yes | `--color-primary-fg` |
| `background` | `string` | yes | `--color-bg` |
| `surface` | `string` | yes | `--color-surface` |
| `surfaceHover` | `string` | no | `--color-surface-hover` (default derived) |
| `text` | `string` | yes | `--color-text` |
| `textMuted` | `string` | yes | `--color-text-muted` |
| `border` | `string` | no | `--color-border` (default derived) |

Theme values are CSS color strings (`#hex`, `rgb()`, `hsl()`).

### Meta

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | yes | `<title>` and OG title |
| `description` | `string` | yes | Meta description, OG description |
| `ogImage` | `string` | no | Absolute URL for OG/Twitter image; falls back to `avatarUrl` |
| `canonicalUrl` | `string` | no | Canonical URL for SEO; recommended for production |
| `locale` | `string` | no | Default `pt_BR`; `<html lang>` derived from profile |

### LucideIconName

Type alias: union of string literals matching lucide-react export names used in
the project (e.g., `'Link' | 'Globe' | 'ShoppingBag' | 'MessageCircle' | ...`).

Maintained in `types.ts`; config comments list available icons for page owners.

## Component Props (derived types)

Defined in `types.ts`, separate from config entities:

```text
ProfileCardProps   ← Pick<Profile>
LinkButtonProps    ← Pick<LinkItem, 'title' | 'url' | 'icon' | 'highlighted'>
LinkListProps      ← { links: LinkButtonProps[] }
SocialIconsProps   ← { socials: SocialLink[] }
```

## Relationships

```text
SiteConfig 1──1 Profile
SiteConfig 1──* LinkItem
SiteConfig 1──* SocialLink
SiteConfig 1──1 Theme
SiteConfig 1──1 Meta
```

## State Transitions

None — static configuration. Changes require editing `config.ts` and rebuilding.

## Runtime Transformations (App layer, not in components)

| Input | Rule | Output |
|-------|------|--------|
| `links` with invalid URL | Filter out | Sanitized `LinkItem[]` |
| `links` empty after filter | Show empty state | UI message |
| `handle` without `@` | Prefix `@` | Display string |
| `theme` partial | Merge with defaults from `design-system.md` | Complete CSS vars |
| `meta.ogImage` missing | Use `profile.avatarUrl` | OG image URL |
