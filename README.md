# Biolink

Página de bio links estática — alternativa gratuita e personalizável ao Linktree.

## Personalização

Edite **apenas** [`src/config.ts`](src/config.ts) para alterar perfil, links, redes sociais, tema e metadados SEO.

Consulte os comentários no arquivo para ver os campos e ícones disponíveis.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Build

```bash
npm run build
```

Gera a pasta `dist/` com arquivos estáticos prontos para qualquer CDN.

## Deploy

### GitHub Pages (principal)

1. Ajuste `meta.canonicalUrl` e URLs em `public/sitemap.xml` / `public/robots.txt`
2. Se o repositório não se chama `biolink`, atualize `base` em `vite.config.ts`
3. Publique:

```bash
GITHUB_PAGES=true npm run deploy
```

Ou use `npm run deploy` após configurar `GITHUB_PAGES=true` no ambiente.

### Vercel / Netlify

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Base directory**: `/` (não defina subpath)

## Validação

Siga o checklist em [`specs/001-bio-links-page/quickstart.md`](specs/001-bio-links-page/quickstart.md).

## Stack

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS v4
- lucide-react + Framer Motion

Design tokens: [`design-system.md`](design-system.md)
