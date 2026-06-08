# Implementation Plan: Página de Bio Links

**Branch**: `001-bio-links-page` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-bio-links-page/spec.md`

## Summary

Build a static, mobile-first bio links page (Linktree alternative) with React 19,
TypeScript, and Vite. All personalization flows through a single `src/config.ts`
file. The page displays a profile card, ordered link buttons with lucide icons, an
optional social icons row, theme colors from config, and SEO metadata. Deploy
target is GitHub Pages via `npm run deploy`, with Tailwind CSS v4 for styling and
Framer Motion for subtle entrance animations.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19

**Primary Dependencies**: `react`, `react-dom`, `lucide-react`, `framer-motion`,
`tailwindcss` v4, `@tailwindcss/vite`

**Storage**: N/A (static config in `src/config.ts`)

**Testing**: Manual validation per `quickstart.md`; no test framework in v1

**Target Platform**: Static web — GitHub Pages (primary), Vercel/Netlify (secondary)

**Project Type**: Single-page web application (SPA)

**Performance Goals**: First contentful paint < 2s on 3G; bundle size minimal

**Constraints**: 320px min viewport; WCAG 2.1 AA; config-only customization;
no global state; `vite build` → static `dist/`

**Scale/Scope**: 1 page, ~8 source files, 4 components, 1 config file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Requirement | Status |
|------|-------------|--------|
| Config | End-user customization needs only `src/config.ts` edits | ✅ |
| Types | New entities/interfaces in `types.ts`; no implicit `any` | ✅ |
| Dependencies | No new production deps without Complexity Tracking row | ⚠️ see below |
| Design | UI uses tokens from `design-system.md`; works at 320px | ✅ |
| A11y | Links have `aria-label`; images have `alt`; WCAG AA contrast | ✅ |
| SEO | Meta/OG/JSON-LD impacts documented if public page changes | ✅ |
| Deploy | `vite build` remains static CDN / GitHub Pages compatible | ✅ |

**Post-design re-check**: All gates pass with documented exceptions for Tailwind
v4 and Framer Motion (Complexity Tracking).

## Project Structure

### Documentation (this feature)

```text
specs/001-bio-links-page/
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — entities and validation
├── quickstart.md        # Phase 1 — validation scenarios
├── contracts/
│   ├── config-schema.md
│   └── component-props.md
└── tasks.md             # Phase 2 (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── config.ts            # ONLY file the page owner edits
├── types.ts             # SiteConfig, Profile, LinkItem, Theme, Meta, props
├── App.tsx              # Composes page; applies theme; sanitizes config
├── main.tsx             # React entry
├── assets/
│   └── avatar.jpg       # Default profile photo
├── components/
│   ├── ProfileCard.tsx
│   ├── LinkButton.tsx
│   ├── LinkList.tsx
│   ├── SocialIcons.tsx
│   └── SeoHead.tsx
├── lib/
│   ├── icons.ts         # getLucideIcon helper
│   └── config-utils.ts  # URL validation, link filtering, theme merge
└── styles/
    └── globals.css      # @import tailwind; @theme tokens; CSS reset

public/
├── robots.txt
└── sitemap.xml

design-system.md         # Visual token authority (repo root)
index.html
vite.config.ts
tsconfig.json
tsconfig.app.json
package.json
```

**Structure Decision**: Single Vite SPA at repository root. No backend, no tests
directory in v1. `lib/` holds non-UI helpers to keep components free of business
logic per constitution Principle I.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Tailwind CSS v4 (constitution lists CSS Modules) | User-mandated stack; rapid mobile-first layout; `@theme` maps to `design-system.md` tokens | Plain CSS requires more boilerplate for responsive spacing and theme overrides |
| framer-motion (beyond React + icon lib) | User-mandated entrance animations and social hover; tree-shakeable named imports | CSS-only motion cannot stagger children as cleanly; user explicitly requested Framer Motion |
| gh-pages devDependency | `npm run deploy` script for GitHub Pages one-command publish | Manual dist upload is error-prone for non-technical page owners |

**Note**: `lucide-react` satisfies constitution "one icon library" (replaces
generic `react-icons` example). No Redux/Zustand/Context — aligned with
constitution and user input.

## Phase 0: Research

Completed — see [research.md](./research.md).

Key decisions: Vite SPA, Tailwind v4 + CSS variables, lucide-react, Framer
Motion (limited scope), `SeoHead` for meta/JSON-LD, `gh-pages` deploy script.

## Phase 1: Design & Contracts

Completed artifacts:

- [data-model.md](./data-model.md) — entities, validation, transforms
- [contracts/config-schema.md](./contracts/config-schema.md) — config.ts contract
- [contracts/component-props.md](./contracts/component-props.md) — component interfaces
- [quickstart.md](./quickstart.md) — end-to-end validation guide
- [design-system.md](../../design-system.md) — color, type, spacing, components

### Implementation sequence (for `/speckit-tasks`)

1. **Scaffold**: Vite + React 19 + TS strict + Tailwind v4 + dependencies
2. **Foundation**: `types.ts`, `design-system.md` tokens in `globals.css`, `config.ts` seed
3. **Lib**: `icons.ts`, `config-utils.ts` (filter links, theme merge)
4. **Components**: ProfileCard → LinkButton → LinkList → SocialIcons → SeoHead
5. **App**: Compose layout, apply theme CSS vars, wire config
6. **SEO**: robots.txt, sitemap.xml, SeoHead JSON-LD
7. **Deploy**: vite `base` config, `deploy` script, README quickstart link
8. **Polish**: Framer Motion stagger, reduced-motion, edge cases, 320px QA

## Phase 2: Tasks

Not generated by this command. Run `/speckit-tasks` to produce `tasks.md`.
