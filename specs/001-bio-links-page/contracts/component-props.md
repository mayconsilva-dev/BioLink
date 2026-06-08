# Contract: Component Props

**Version**: 1.0.0 | **Feature**: `001-bio-links-page`

All prop interfaces MUST be declared in `src/types.ts`. Components MUST NOT
define inline prop types.

## ProfileCard

```typescript
interface ProfileCardProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  avatarAlt: string; // derived: "{name} profile photo"
}
```

**Rendering obligations**:
- Avatar: circular, `alt={avatarAlt}`, error fallback
- Name: `<h1>`, single line preferred
- Handle: visible, prefixed with `@`
- Bio: `line-clamp-3` max

## LinkButton

```typescript
interface LinkButtonProps {
  title: string;
  url: string;
  icon: LucideIconName;
  highlighted?: boolean;
}
```

**Rendering obligations**:
- Render as `<a href={url} target="_blank" rel="noopener noreferrer">`
- Accessible name: visible `title` (satisfies FR-010)
- Icon 20px left of title
- `highlighted` applies primary theme variant

## LinkList

```typescript
interface LinkListProps {
  links: LinkButtonProps[];
  emptyMessage?: string; // default: "Nenhum link disponível."
}
```

**Rendering obligations**:
- `<nav aria-label="Links principais">` wrapper
- Vertical stack, gap per `design-system.md`
- Empty state when `links.length === 0`

## SocialIcons

```typescript
interface SocialIconsProps {
  socials: SocialLink[];
}
```

**Rendering obligations**:
- `<nav aria-label="Redes sociais">` wrapper
- Each link: `aria-label={social.label}`, `target="_blank"`, `rel="noopener noreferrer"`
- Hidden when `socials.length === 0`

## SeoHead

```typescript
interface SeoHeadProps {
  meta: Meta;
  profile: Pick<Profile, 'name' | 'avatarUrl'>;
  socialUrls: string[]; // for JSON-LD sameAs
}
```

**Rendering obligations**:
- Inject/update `<title>`, description, OG, Twitter Card meta
- Inject JSON-LD `Person` script with `name`, `image`, `sameAs`

## App (composition)

```typescript
// App.tsx — no props; imports siteConfig from config.ts
// Applies theme CSS variables to root wrapper
// Composes: SeoHead, ProfileCard, SocialIcons, LinkList
```

Components MUST NOT import from `config.ts` except `App.tsx`.
