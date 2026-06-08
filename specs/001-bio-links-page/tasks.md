# Tasks: Página de Bio Links

**Input**: Design documents from `specs/001-bio-links-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — manual validation per `quickstart.md` only.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US6)
- All descriptions include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Vite + React 19 + TypeScript + Tailwind v4 project

- [X] T001 Scaffold Vite React TypeScript project at repository root with `npm create vite@latest . -- --template react-ts`
- [X] T002 Install production dependencies `lucide-react` and `framer-motion` in `package.json`
- [X] T003 Install dev dependencies `tailwindcss`, `@tailwindcss/vite`, and `gh-pages` in `package.json`
- [X] T004 [P] Configure `vite.config.ts` with `@vitejs/plugin-react` and `@tailwindcss/vite` plugins
- [X] T005 [P] Enable `"strict": true` in `tsconfig.json` and `tsconfig.app.json`
- [X] T006 [P] Create directory structure `src/components/`, `src/lib/`, `src/styles/`, `src/assets/`, and `public/` per `plan.md`

**Checkpoint**: Project scaffolds and `npm run dev` launches (may be empty page)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, config, design tokens, and lib helpers that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Define `SiteConfig`, `Profile`, `LinkItem`, `SocialLink`, `Theme`, `Meta`, `LucideIconName`, and component prop interfaces in `src/types.ts`
- [X] T008 [P] Implement `getLucideIcon` helper with fallback to `Link` icon in `src/lib/icons.ts`
- [X] T009 [P] Implement `filterValidLinks`, `mergeTheme`, and `formatHandle` in `src/lib/config-utils.ts`
- [X] T010 Create seed `siteConfig` export with sample profile, links, socials, theme, and meta in `src/config.ts`
- [X] T011 [P] Map `design-system.md` tokens to CSS variables and `@theme` block in `src/styles/globals.css`
- [X] T012 [P] Create `index.html` shell with charset, viewport meta, and Inter font preconnect
- [X] T013 Wire React entry with `globals.css` import in `src/main.tsx`
- [X] T014 [P] Add default profile photo placeholder in `src/assets/avatar.jpg`
- [X] T015 Verify `npm run dev` starts with zero TypeScript errors under strict mode

**Checkpoint**: Foundation ready — `siteConfig` loads, types compile, design tokens available

---

## Phase 3: User Story 1 — Visitante descobre perfil e navega pelos links (Priority: P1) 🎯 MVP

**Goal**: Visitor sees profile (photo, name, @handle, bio) and clickable link buttons with icon + title

**Independent Test**: Open dev URL → profile visible → click link → reaches correct destination

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement `ProfileCard` with avatar, name, handle, and bio in `src/components/ProfileCard.tsx`
- [X] T017 [P] [US1] Implement `LinkButton` with lucide icon and title label in `src/components/LinkButton.tsx`
- [X] T018 [US1] Implement `LinkList` with `<nav aria-label="Links principais">` wrapper in `src/components/LinkList.tsx`
- [X] T019 [US1] Compose `ProfileCard` and `LinkList` in `src/App.tsx` using sanitized config from `src/lib/config-utils.ts`
- [X] T020 [US1] Map `siteConfig.profile` and filtered `siteConfig.links` to component props in `src/App.tsx`
- [X] T021 [US1] Add empty-state message when links array is empty after filtering in `src/components/LinkList.tsx`
- [X] T022 [US1] Validate US1 acceptance scenarios per `specs/001-bio-links-page/quickstart.md` visitor flows

**Checkpoint**: MVP functional — profile + links render and navigate correctly

---

## Phase 4: User Story 2 — Visitante usa a página no celular (Priority: P1)

**Goal**: Page works flawlessly on mobile from 320px width with comfortable touch targets

**Independent Test**: Resize to 320px → no horizontal scroll → buttons tappable → content readable

### Implementation for User Story 2

- [X] T023 [P] [US2] Apply mobile-first centered layout with `--page-max-width` in `src/App.tsx`
- [X] T024 [P] [US2] Enforce `--link-min-height` (52px) minimum touch target in `src/components/LinkButton.tsx`
- [X] T025 [US2] Add `line-clamp-3` on bio and prevent horizontal overflow in `src/components/ProfileCard.tsx`
- [X] T026 [US2] Apply `--page-padding-x` and vertical spacing tokens for 320px viewport in `src/App.tsx`
- [X] T027 [US2] Validate US2 at 320px width and throttled 3G per `specs/001-bio-links-page/quickstart.md`

**Checkpoint**: Mobile layout passes 320px and touch-target requirements

---

## Phase 5: User Story 3 — Visitante abre links sem perder a página (Priority: P2)

**Goal**: All external links open in a new tab; bio page stays open in original tab

**Independent Test**: Click any link → new tab opens → original tab still shows bio page

### Implementation for User Story 3

- [X] T028 [US3] Add `target="_blank"` and `rel="noopener noreferrer"` to anchor in `src/components/LinkButton.tsx`
- [X] T029 [US3] Validate US3 acceptance scenarios — main links open in new tab and bio page remains per `spec.md`

**Checkpoint**: All navigational links open in new tab

---

## Phase 6: User Story 4 — Dono personaliza conteúdo sem editar código (Priority: P1)

**Goal**: Owner changes profile, links, and order by editing only `src/config.ts`

**Independent Test**: Edit `config.ts` only → reload/build → changes appear without touching components

### Implementation for User Story 4

- [X] T031 [P] [US4] Add field-level documentation comments for page owners in `src/config.ts`
- [X] T032 [US4] Verify profile field changes in `src/config.ts` reflect after dev reload without component edits
- [X] T033 [US4] Verify add, remove, and reorder links via array order in `src/config.ts` only
- [X] T034 [US4] Validate US4 config-only customization per `specs/001-bio-links-page/quickstart.md`

**Checkpoint**: Full content personalization achievable via `src/config.ts` alone

---

## Phase 7: User Story 5 — Dono personaliza tema visual (Priority: P2)

**Goal**: Owner sets primary, background, and button colors via `src/config.ts` theme section

**Independent Test**: Change `theme` in `config.ts` → reload → colors update consistently

### Implementation for User Story 5

- [X] T035 [US5] Apply `siteConfig.theme` as CSS custom properties on root wrapper in `src/App.tsx`
- [X] T036 [US5] Wire `highlighted` variant on `LinkButton` to `--color-primary` tokens in `src/components/LinkButton.tsx`
- [X] T037 [US5] Merge partial theme with defaults from `design-system.md` via `mergeTheme` in `src/lib/config-utils.ts`
- [X] T038 [US5] Validate US5 theme changes via `src/config.ts` only per `specs/001-bio-links-page/quickstart.md`

**Checkpoint**: Theme customization works exclusively through config

---

## Phase 8: User Story 6 — Dono publica em hospedagem estática (Priority: P2)

**Goal**: `npm run build` produces static `dist/`; `npm run deploy` publishes to GitHub Pages

**Independent Test**: Run build → `dist/` exists → deploy → public URL serves page correctly

### Implementation for User Story 6

- [X] T039 [P] [US6] Configure `base` path for GitHub Pages project sites in `vite.config.ts`
- [X] T040 [P] [US6] Add `"build": "tsc -b && vite build"` and `"deploy": "npm run build && gh-pages -d dist"` scripts in `package.json`
- [X] T041 [US6] Verify `npm run build` produces self-contained static `dist/` with zero TypeScript errors
- [X] T042 [US6] Document GitHub Pages, Vercel, and Netlify deploy steps in `README.md`
- [X] T043 [US6] Validate US6 build and deploy flow per `specs/001-bio-links-page/quickstart.md`

**Checkpoint**: One-command build and deploy path works

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: SEO, social icons, animations, edge cases, accessibility, constitution compliance

- [X] T044 [P] Implement `SocialIcons` with `aria-label`, `target="_blank"`, and `rel="noopener noreferrer"` in `src/components/SocialIcons.tsx`
- [X] T045 [P] Implement `SeoHead` for title, meta, OG, Twitter Card, and JSON-LD Person schema in `src/components/SeoHead.tsx`
- [X] T046 Integrate `SocialIcons` and `SeoHead` into page composition in `src/App.tsx`
- [X] T047 [P] Add Framer Motion staggered page entrance with `prefers-reduced-motion` guard in `src/App.tsx`
- [X] T048 [P] Add avatar `onError` fallback to `src/assets/avatar.jpg` and initials placeholder in `src/components/ProfileCard.tsx`
- [X] T049 [P] Harden `filterValidLinks` for invalid URLs and long title truncation in `src/lib/config-utils.ts`
- [X] T050 [P] Add `public/robots.txt` and `public/sitemap.xml` for static SEO
- [X] T051 Run accessibility audit — aria-labels, alt text, WCAG AA contrast per `quickstart.md`
- [X] T052 Run full `specs/001-bio-links-page/quickstart.md` validation checklist and Constitution Check gates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational — MVP core
- **US2 (Phase 4)**: Depends on US1 (layout refines existing components)
- **US3 (Phase 5)**: Depends on US1 (`LinkButton` must exist); SocialIcons stub ok until T044
- **US4 (Phase 6)**: Depends on Foundational (`config.ts`); validation needs US1 rendered
- **US5 (Phase 7)**: Depends on US1 (`LinkButton` highlighted variant) + Foundational theme types
- **US6 (Phase 8)**: Depends on Setup; build validation needs at least US1 complete
- **Polish (Phase 9)**: Depends on US1–US6 desired stories being complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 | Foundational | Phase 2 complete |
| US2 | US1 | Phase 3 complete |
| US3 | US1 | Phase 3 complete |
| US4 | Foundational + US1 render | Phase 3 complete (validation) |
| US5 | US1 + Foundational | Phase 3 complete |
| US6 | Setup + US1 | Phase 3 complete (meaningful build) |

### Within Each User Story

- Components before App integration
- App integration before story validation task
- Story validation before moving to next priority

---

## Parallel Execution Examples

### Phase 1 (Setup)

```bash
# Parallel after T003:
T004: Configure vite.config.ts
T005: Enable strict in tsconfig.json + tsconfig.app.json
T006: Create src/ directory structure
```

### Phase 2 (Foundational)

```bash
# Parallel after T007:
T008: src/lib/icons.ts
T009: src/lib/config-utils.ts
T011: src/styles/globals.css
T012: index.html
T014: src/assets/avatar.jpg
```

### Phase 3 (US1 — MVP)

```bash
# Parallel component creation:
T016: src/components/ProfileCard.tsx
T017: src/components/LinkButton.tsx
# Then sequential:
T018: src/components/LinkList.tsx
T019–T021: src/App.tsx integration
```

### Phase 9 (Polish)

```bash
# Parallel finishing tasks:
T044: src/components/SocialIcons.tsx
T045: src/components/SeoHead.tsx
T047: Framer Motion in src/App.tsx
T048: Avatar fallback in ProfileCard.tsx
T049: config-utils hardening
T050: public/robots.txt + public/sitemap.xml
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Profile + links work (T022)
5. Demo or deploy if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → profile + links (MVP!)
3. US2 → mobile hardening
4. US4 → confirm config-only workflow
5. US3 + US5 → new-tab behavior + theme
6. US6 → deploy pipeline
7. Polish → SEO, socials, animations, edge cases

### Suggested MVP Scope

**Phases 1–3 only** (T001–T022): delivers core visitor value — profile card and
navigable link list from `src/config.ts`.

---

## Task Summary

| Phase | Story | Tasks | Parallel tasks |
|-------|-------|-------|----------------|
| 1 Setup | — | T001–T006 (6) | T004, T005, T006 |
| 2 Foundational | — | T007–T015 (9) | T008, T009, T011, T012, T014 |
| 3 US1 | P1 🎯 | T016–T022 (7) | T016, T017 |
| 4 US2 | P1 | T023–T027 (5) | T023, T024 |
| 5 US3 | P2 | T028–T029 (2) | — |
| 6 US4 | P1 | T031–T034 (4) | T031 |
| 7 US5 | P2 | T035–T038 (4) | — |
| 8 US6 | P2 | T039–T043 (5) | T039, T040 |
| 9 Polish | — | T044–T052 (9) | T044, T045, T047, T048, T049, T050 |

**Total**: 51 tasks

**Format validation**: All tasks use `- [ ] [TaskID] [P?] [Story?] Description with file path` ✅
