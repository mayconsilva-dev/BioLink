# Quickstart: Página de Bio Links

**Feature**: `001-bio-links-page` | **Branch**: `001-bio-links-page`

Validation guide — proves the feature works end-to-end after implementation.

## Prerequisites

- Node.js 20+
- npm 10+
- Git (for deploy script)

## Setup

```bash
# From repository root
npm install
```

## Local Development

```bash
npm run dev
```

Open `http://localhost:5173`. Expected:
- Profile card with name, @handle, bio, avatar
- Link buttons with icons and titles
- Social icon row (if configured in `src/config.ts`)
- No horizontal scroll at 320px (resize DevTools)

## Customize (config-only)

1. Edit **only** `src/config.ts`
2. Change `profile.name`, add a link, update `theme.primary`
3. Save — Vite HMR reloads the page
4. Confirm changes appear without touching components

## Build

```bash
npm run build
```

Expected:
- Exit code 0
- `dist/` folder with `index.html`, assets, no server files
- TypeScript strict: zero errors

## Deploy (GitHub Pages)

```bash
npm run deploy
```

Expected:
- Builds project, publishes `dist/` via `gh-pages`
- Site live at `https://<user>.github.io/biolink/` (repo name dependent)

For Vercel/Netlify: connect repo, build command `npm run build`, output `dist`.

## Validation Checklist

### Visitor flows (US1–US3)

- [ ] Profile shows photo, name, @handle, bio
- [ ] Each link shows icon + title (not raw URL)
- [ ] Clicking a link opens correct destination in **new tab**
- [ ] Page usable at 320px width, no horizontal scroll
- [ ] Primary content visible within 2s on throttled 3G (DevTools)

### Owner flows (US4–US6)

- [ ] Edit `config.ts` only → profile, links, theme update after reload/build
- [ ] `npm run build` succeeds with `strict: true`
- [ ] `npm run deploy` publishes to GitHub Pages (or manual `dist/` upload works)

### Accessibility (FR-010, FR-011)

- [ ] All links have accessible names (visible text or `aria-label`)
- [ ] Avatar has descriptive `alt`
- [ ] Contrast passes WCAG AA (use browser axe or Lighthouse)

### SEO (FR-009)

- [ ] `<title>` matches `meta.title`
- [ ] Meta description present
- [ ] OG tags present (check Elements panel after load)
- [ ] JSON-LD `Person` script in document

### Edge cases

- [ ] Broken `avatarUrl` → fallback image or initials, layout intact
- [ ] Invalid link URL in config → link not shown
- [ ] Empty `links` array → friendly empty message
- [ ] Long link title → truncates without breaking button

## Key References

- Configuration contract: [contracts/config-schema.md](./contracts/config-schema.md)
- Component props: [contracts/component-props.md](./contracts/component-props.md)
- Data model: [data-model.md](./data-model.md)
- Design tokens: [design-system.md](../../design-system.md)
