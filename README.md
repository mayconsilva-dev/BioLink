# Biolink

Plataforma de bio links **multiusuário** — alternativa gratuita e personalizável ao Linktree. Qualquer pessoa cria uma conta e ganha a própria página em `#/<handle>`.

## Como funciona

- **Página inicial** (`#/`): apresentação + botão para entrar/criar conta.
- **Página pública** (`#/<handle>`, ex.: `#/maria`): o perfil e os links daquele usuário.
- **Painel** (`#/admin`): cada usuário edita o próprio perfil (foto, nome, @handle, bio) e os links.

O **tema visual**, os metadados de SEO e os ícones disponíveis ficam em [`src/config.ts`](src/config.ts) (compartilhados por todas as páginas).

## Configuração do Supabase

Os perfis, links e fotos ficam no Supabase. Sem isso configurado, o painel exibe uma mensagem de configuração.

### 1. Crie um projeto no Supabase

1. Em [supabase.com](https://supabase.com), crie um projeto (plano gratuito serve).
2. Em **SQL Editor → New query**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso cria as tabelas `links` e `profiles`, o bucket de fotos `avatars`, as políticas de segurança (RLS) e o gatilho que cria um perfil automaticamente a cada novo cadastro.

### 2. (Opcional) Confirmação de e-mail

Como o cadastro é aberto, por padrão o Supabase envia um e-mail de confirmação. Em **Authentication → Providers → Email**, desative "Confirm email" se quiser que o cadastro entre direto, sem confirmação.

> Você também pode criar usuários manualmente em **Authentication → Users → Add user**.

### 3. Configure as credenciais no projeto

```bash
cp .env.example .env.local
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (em **Project Settings → API**). Reinicie `npm run dev`.

### 4. Use o painel

- Acesse `http://localhost:5173/#/admin` (ou clique em **Entrar ou criar conta** na página inicial).
- **Crie uma conta** (link abaixo do formulário) ou faça login.
- Defina seu **@handle** (vira sua URL pública), envie uma **foto** (câmera ou galeria), preencha nome e bio, e gerencie os links. Tudo salva automaticamente.
- Veja sua página em `#/<seu-handle>`.

> A `anon key` é pública por design — a segurança vem das políticas RLS do banco. Nunca use a `service_role key` no front-end.

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
