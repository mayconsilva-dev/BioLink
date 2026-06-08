# Biolink Design System

Authoritative reference for colors, typography, spacing, and component styling.
All UI implementation MUST use these tokens — via CSS custom properties in
`src/styles/globals.css` and Tailwind utility classes mapped to those tokens.

## Design Principles

1. **Mobile-first** — design for 320px, enhance for larger viewports.
2. **Clarity over decoration** — profile and links are the hero; UI chrome stays minimal.
3. **Touch-friendly** — minimum 44×44px tap targets on interactive elements.
4. **Accessible contrast** — all text/UI pairs MUST meet WCAG 2.1 AA.

## Color Tokens

Semantic tokens (defaults). Runtime theme overrides from `config.ts` map to
`--color-*` custom properties on `:root`.

| Token | CSS Variable | Default | Usage |
|-------|--------------|---------|-------|
| Background | `--color-bg` | `#0f0f12` | Page background |
| Surface | `--color-surface` | `#1a1a21` | Cards, link buttons |
| Surface Hover | `--color-surface-hover` | `#24242e` | Button hover state |
| Primary | `--color-primary` | `#7c3aed` | Accent, highlighted links |
| Primary Foreground | `--color-primary-fg` | `#ffffff` | Text on primary surfaces |
| Text | `--color-text` | `#f4f4f5` | Primary body text |
| Text Muted | `--color-text-muted` | `#a1a1aa` | Handle, secondary copy |
| Border | `--color-border` | `#2e2e3a` | Subtle dividers, button outline |
| Error | `--color-error` | `#ef4444` | Broken image fallback border |

**Contrast rule**: `--color-text` on `--color-bg` and `--color-surface` MUST be
≥ 4.5:1. `--color-primary-fg` on `--color-primary` MUST be ≥ 4.5:1.

## Typography

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| Font Sans | `--font-sans` | `'Inter', system-ui, sans-serif` | All UI text |
| Size XS | `--text-xs` | `0.75rem` / 12px | Labels, captions |
| Size SM | `--text-sm` | `0.875rem` / 14px | Handle, bio |
| Size Base | `--text-base` | `1rem` / 16px | Link button titles |
| Size LG | `--text-lg` | `1.125rem` / 18px | Profile name |
| Size XL | `--text-xl` | `1.25rem` / 20px | Optional emphasis |
| Weight Normal | — | `400` | Bio body |
| Weight Medium | — | `500` | Link titles |
| Weight Semibold | — | `600` | Profile name |
| Line Height Tight | `--leading-tight` | `1.25` | Headings |
| Line Height Normal | `--leading-normal` | `1.5` | Body, bio |

Load Inter via Google Fonts in `index.html` (weights 400, 500, 600).

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `0.25rem` (4px) | Icon gaps |
| `--space-2` | `0.5rem` (8px) | Tight internal padding |
| `--space-3` | `0.75rem` (12px) | Social icon gap |
| `--space-4` | `1rem` (16px) | Standard padding |
| `--space-5` | `1.25rem` (20px) | Section gap (mobile) |
| `--space-6` | `1.5rem` (24px) | Profile → links gap |
| `--space-8` | `2rem` (32px) | Page vertical padding |
| `--space-10` | `2.5rem` (40px) | Desktop page padding |

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--page-max-width` | `480px` | Content column max width |
| `--page-padding-x` | `1rem` (16px) | Horizontal page inset (320px+) |
| `--avatar-size` | `96px` | Profile photo diameter |
| `--link-min-height` | `52px` | Link button min height (touch) |
| `--social-icon-size` | `40px` | Social icon button size |

**Breakpoint**: single column at all sizes; content centered with `max-width`.

## Radii & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.5rem` (8px) | Social icons |
| `--radius-md` | `0.75rem` (12px) | Link buttons |
| `--radius-full` | `9999px` | Avatar |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.25)` | Link buttons at rest |
| `--shadow-md` | `0 4px 12px rgb(0 0 0 / 0.35)` | Highlighted links |

## Component Specs

### ProfileCard

- Avatar: `--avatar-size`, `--radius-full`, `object-fit: cover`
- Name: `--text-lg`, `--font-semibold`, `--color-text`, centered
- Handle: `--text-sm`, `--color-text-muted`, prefixed with `@` if missing
- Bio: `--text-sm`, `--color-text-muted`, max 3 lines (`line-clamp-3`), centered

### LinkButton

- Full width within page column, `--link-min-height`
- Background: `--color-surface`; hover: `--color-surface-hover`
- Highlighted variant: `--color-primary` bg, `--color-primary-fg` text
- Icon: 20px, left-aligned with `--space-4` padding
- Title: `--text-base`, `--font-medium`, truncate with ellipsis if overflow
- Border: 1px `--color-border` (non-highlighted only)

### LinkList

- Vertical stack, gap `--space-3`
- Empty state: muted message using `--color-text-muted`

### SocialIcons

- Horizontal row, centered, gap `--space-3`
- Each icon: `--social-icon-size` circle, `--color-surface` background
- Hover: scale 1.05 (Framer Motion), `--color-surface-hover` background

## Motion

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page enter | 400ms | `ease-out` | Stagger children fade+slide up |
| Link hover | 150ms | `ease-in-out` | Background color transition |
| Social hover | 200ms | `spring` | Scale + background |

Keep animations subtle; respect `prefers-reduced-motion` (disable transforms).

## Tailwind Mapping

Map CSS variables in `globals.css` using `@theme` (Tailwind v4):

```css
@theme {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  /* ... */
}
```

Use semantic utilities: `bg-bg`, `text-text`, `bg-surface`, `text-primary`, etc.
