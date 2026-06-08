<!--
Sync Impact Report
==================
Version change: (template/unratified) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - I. TypeScript Strict & Typed Components
  - II. Config-Driven Architecture
  - III. Minimal Dependency Surface
  - IV. Mobile-First Design System
  - V. Accessibility & SEO
  - VI. Static Deploy
  - Technology Stack & Constraints
  - Development Workflow & Quality Gates
Removed sections: None (template placeholders replaced)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ not present (skipped)
  - design-system.md ⚠ pending (referenced but not yet created)
Follow-up TODOs:
  - TODO(design-system.md): Create design-system.md as the authoritative
    source for colors, typography, and spacing before UI implementation.
-->

# Biolink Constitution

## Core Principles

### I. TypeScript Strict & Typed Components

All application code MUST comply with strict TypeScript settings (`strict: true` in
`tsconfig.json`). Implicit `any` is forbidden — every value MUST have an explicit
or inferable type.

- Components MUST be functional only; class components are forbidden.
- Every component's props MUST be declared as a named interface in `types.ts`
  (or a dedicated `src/types/` module); inline anonymous prop types are
  forbidden in component files.
- UI components MUST NOT contain business logic (data transformation, URL
  building, validation rules, or conditional content rules). Components render
  props; configuration and contracts live elsewhere.

**Rationale**: A bio-link page is small but long-lived. Strict typing and thin
components prevent regressions when non-developers customize content via
`config.ts`.

### II. Config-Driven Architecture (NON-NEGOTIABLE)

All end-user personalization MUST live in `src/config.ts`. No other file MAY be
edited to customize the published page (profile, links, theme tokens, SEO
metadata, social handles).

The data flow MUST follow a single direction:

```text
src/config.ts (data) → src/types.ts (contracts) → src/components/ (UI)
```

- `config.ts` exports plain data objects conforming to types in `types.ts`.
- Components MUST NOT hardcode user-specific strings, URLs, or branding.
- Adding a new link or changing copy MUST require only a `config.ts` edit.

**Rationale**: The product promise is a static Linktree alternative that anyone
can fork and personalize without touching React code.

### III. Minimal Dependency Surface

The runtime dependency graph MUST stay minimal. Allowed production dependencies:

- `react` and `react-dom` (React 19)
- One icon library (e.g., `react-icons` or equivalent)

Build tooling (`vite`, `typescript`, `@vitejs/plugin-react`) is dev-only.
Adding any other production dependency MUST be justified in the plan's
Complexity Tracking table and rejected if a native or CSS solution exists.

**Rationale**: Fewer dependencies mean faster builds, smaller bundles, and
reliable static hosting without server-side tooling.

### IV. Mobile-First Design System

Every layout and component MUST work correctly at **320px** viewport width
without horizontal scroll or clipped interactive targets.

Visual design MUST follow `design-system.md` as the single source of truth for:

- Color palette and semantic tokens
- Typography scale and font stacks
- Spacing, radii, and elevation

Deviations from `design-system.md` MUST be documented and approved during plan
review. Until `design-system.md` exists, no visual implementation MAY proceed
beyond structural scaffolding.

**Rationale**: Bio-link pages are consumed almost exclusively on mobile devices;
desktop is an enhancement, not the baseline.

### V. Accessibility & SEO

**Accessibility** (minimum WCAG 2.1 AA):

- Every navigational link MUST have a descriptive `aria-label` (or visible text
  that serves the same purpose).
- Every image MUST have meaningful `alt` text; decorative images MUST use
  `alt=""`.
- Text and interactive elements MUST meet WCAG AA contrast ratios (4.5:1 normal
  text, 3:1 large text and UI components).

**SEO** (local and structured):

- `index.html` MUST include unique `<title>`, meta description, canonical URL,
  Open Graph, and Twitter Card tags sourced from `config.ts`.
- The page MUST emit JSON-LD structured data (`Person` or `ProfilePage` schema)
  reflecting profile name, URL, and same-as social links.
- Semantic HTML MUST be used (`<main>`, `<nav>`, heading hierarchy).
- A `sitemap.xml` and `robots.txt` SHOULD be generated or committed for GitHub
  Pages deployment.

**Rationale**: Discoverability and inclusivity are product features, not
afterthoughts, for a public-facing personal landing page.

### VI. Static Deploy

The output of `vite build` MUST be a self-contained `dist/` directory deployable
to any static CDN or object storage **without** server configuration, environment
injection, or runtime API keys.

- GitHub Pages is the primary deployment target; `base` path configuration MUST
  support project pages (`/<repo>/`) and user/org pages (`/`).
- No client-side secrets, analytics keys hardcoded in source, or server-side
  rendering requirements.
- Asset paths MUST be relative or base-aware so the site works when served from
  a subdirectory.

**Rationale**: Zero-ops hosting is a core value proposition of a static bio-link
alternative.

## Technology Stack & Constraints

| Layer | Choice | Constraint |
|-------|--------|------------|
| UI | React 19 | Functional components only |
| Language | TypeScript | `strict: true`, zero implicit `any` |
| Build | Vite | Static `dist/` output |
| Icons | Single lib | No duplicate icon packages |
| Styling | CSS / CSS Modules | No CSS-in-JS runtime unless justified |
| Config | `src/config.ts` | Sole customization entry point |
| Design | `design-system.md` | Authoritative visual tokens |
| Hosting | GitHub Pages | Must work with `vite build` alone |

## Development Workflow & Quality Gates

### Constitution Check (required in every plan)

Before Phase 0 research, the plan MUST verify:

1. **Config gate**: Feature does not require editing files outside `config.ts` for
   end-user customization.
2. **Type gate**: New entities have interfaces in `types.ts`; no new `any`.
3. **Dependency gate**: No new production dependencies without Complexity
   Tracking justification.
4. **Design gate**: UI work references `design-system.md` tokens.
5. **A11y gate**: Links, images, and contrast requirements are in acceptance
   criteria.
6. **SEO gate**: Meta and JSON-LD impacts are listed if the public page changes.
7. **Deploy gate**: `vite build` output remains static-hosting compatible.

### Review expectations

- Pull requests MUST demonstrate `npm run build` (or `vite build`) succeeds.
- Visual changes MUST be checked at 320px width.
- Copy or link changes SHOULD be achievable via `config.ts` only.

## Governance

This constitution supersedes ad-hoc conventions, oral tradition, and conflicting
README notes. When in doubt, the constitution wins.

**Amendment procedure**:

1. Propose the change with rationale and version bump type (MAJOR / MINOR /
   PATCH).
2. Update `.specify/memory/constitution.md` and propagate to affected templates.
3. Record the Sync Impact Report HTML comment at the top of the constitution.
4. Increment `CONSTITUTION_VERSION` per semantic versioning:
   - **MAJOR**: Principle removed or redefined incompatibly.
   - **MINOR**: New principle or materially expanded guidance.
   - **PATCH**: Clarifications, typos, non-semantic refinements.

**Compliance review**: Every `/speckit-plan`, `/speckit-specify`, and
`/speckit-tasks` artifact MUST include a Constitution Check section. Violations
MUST be documented in Complexity Tracking or resolved before implementation.

Runtime development guidance: read the current feature plan under `specs/` and
`design-system.md` for stack-specific commands and visual tokens.

**Version**: 1.0.0 | **Ratified**: 2026-06-05 | **Last Amended**: 2026-06-05
