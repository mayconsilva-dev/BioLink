# Research: Página de Bio Links

**Feature**: `001-bio-links-page` | **Date**: 2026-06-05

## 1. Stack: React 19 + Vite + TypeScript

**Decision**: Scaffold with `npm create vite@latest` using `react-ts` template,
upgrade to React 19, enable `strict: true` in `tsconfig.app.json`.

**Rationale**: Vite produces static `dist/` with zero server config; React 19 is
the project target; TypeScript strict aligns with constitution Principle I.

**Alternatives considered**:
- Next.js — rejected: SSR/Node hosting unnecessary for static bio page.
- Astro — rejected: user explicitly chose React component architecture.

## 2. Styling: Tailwind CSS v4

**Decision**: Tailwind CSS v4 with `@tailwindcss/vite` plugin; design tokens
defined as CSS custom properties in `src/styles/globals.css` per `design-system.md`;
`@theme` block maps tokens to Tailwind utilities.

**Rationale**: User requirement; utility classes speed mobile-first layout;
runtime theme overrides inject `--color-*` variables from `config.theme` on
`:root` via inline style or `useEffect` in `App.tsx`.

**Alternatives considered**:
- Plain CSS Modules (constitution default) — rejected per user stack input;
  documented in Complexity Tracking.
- CSS-in-JS (styled-components) — rejected: runtime cost, extra dependency.

## 3. Icons: lucide-react

**Decision**: `lucide-react` as the single icon library; `LinkItem.icon` typed as
`LucideIconName` (string union of allowed icon keys); helper `getLucideIcon(name)`
in `src/lib/icons.ts` (not config — infrastructure only).

**Rationale**: User requirement; tree-shakeable; satisfies constitution "one icon
lib" rule (lucide replaces generic react-icons mention).

**Alternatives considered**:
- react-icons — rejected: user specified lucide-react.
- Inline SVGs in config — rejected: violates type safety and DX.

## 4. Animation: Framer Motion

**Decision**: `framer-motion` for page-enter stagger and social icon hover only;
wrap with `prefers-reduced-motion` check; no layout animations on link list.

**Rationale**: User requirement; small bundle impact when importing named exports;
improves perceived polish on mobile.

**Alternatives considered**:
- CSS `@keyframes` only — rejected: user requested Framer Motion; acceptable
  trade-off documented in Complexity Tracking.
- No animation — rejected: user explicitly listed Framer Motion.

## 5. State Management

**Decision**: No global state — props flow `config → App → components`; no
Redux, Zustand, or Context API.

**Rationale**: Single static page with no user session or dynamic data fetching;
config is read once at module load.

## 6. SEO & Meta Tags (Static SPA)

**Decision**: Hybrid approach:
1. `src/components/SeoHead.tsx` — sets `document.title`, meta description, OG/Twitter
   tags, and JSON-LD `Person` schema via `useEffect` + DOM injection.
2. `index.html` — minimal shell with charset, viewport, font preconnect.
3. `public/robots.txt` and `public/sitemap.xml` — committed static files.

**Rationale**: GitHub Pages serves static files; most social crawlers execute
limited JS; `SeoHead` covers browsers and many modern crawlers; build-time
injection can be added later if needed.

**Alternatives considered**:
- `vite-plugin-html` build-time injection — viable Phase 2 enhancement if OG
  previews fail in production testing.
- SSR/SSG (vite-ssg) — rejected: adds complexity beyond static deploy goal.

## 7. Deploy: GitHub Pages

**Decision**:
- `vite.config.ts`: `base: process.env.GITHUB_PAGES === 'true' ? '/biolink/' : '/'`
  (repo name configurable in deploy script).
- `package.json` scripts:
  - `"build"`: `tsc -b && vite build`
  - `"deploy"`: `npm run build && gh-pages -d dist` (devDependency `gh-pages`)
- Support Vercel/Netlify via default `base: '/'` build.

**Rationale**: User requirement for `deploy` script; GitHub Pages is primary
constitution target; `gh-pages` is standard zero-config publish.

**Alternatives considered**:
- GitHub Actions workflow only — deferred; `deploy` script is simpler for v1.
- Manual `dist/` upload — supported but not primary DX.

## 8. Config Validation

**Decision**: Filter invalid links at render time in `App.tsx` (or `src/lib/config.ts`):
skip entries with empty/invalid URLs; show empty state when `links.length === 0`.

**Rationale**: Keeps validation out of UI components per constitution; single
transform layer between config and props.

## 9. Avatar Fallback

**Decision**: `ProfileCard` accepts `onError` on `<img>`; fallback to
`src/assets/avatar.jpg` then initials placeholder div.

**Rationale**: Matches spec edge case for broken avatar URLs.

## 10. design-system.md

**Decision**: Created at repository root (`design-system.md`) as part of Phase 1
design; tokens mirrored in `globals.css`.

**Rationale**: Constitution blocks visual implementation without this file; user
listed it as absolute reference.
