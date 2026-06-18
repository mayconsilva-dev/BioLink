-- =============================================================================
-- BIOLINK — Schema do banco (rode no Supabase: Dashboard > SQL Editor > New query)
-- =============================================================================
-- Cria a tabela `links` e as políticas de segurança (Row Level Security):
--   * Qualquer visitante pode LER os links marcados como visíveis.
--   * Apenas o dono autenticado pode criar/editar/excluir os próprios links.
-- =============================================================================

create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null,
  url         text not null,
  icon        text not null default 'Link',
  highlighted boolean not null default false,
  visible     boolean not null default true,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists links_user_id_position_idx
  on public.links (user_id, position);

-- Habilita Row Level Security
alter table public.links enable row level security;

-- Visitantes (anônimos e autenticados) podem ler os links visíveis
drop policy if exists "links_public_read" on public.links;
create policy "links_public_read"
  on public.links
  for select
  using (visible = true);

-- O dono autenticado pode ler todos os seus links (inclusive ocultos)
drop policy if exists "links_owner_read" on public.links;
create policy "links_owner_read"
  on public.links
  for select
  to authenticated
  using (auth.uid() = user_id);

-- O dono autenticado pode inserir links para si
drop policy if exists "links_owner_insert" on public.links;
create policy "links_owner_insert"
  on public.links
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- O dono autenticado pode atualizar os próprios links
drop policy if exists "links_owner_update" on public.links;
create policy "links_owner_update"
  on public.links
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- O dono autenticado pode excluir os próprios links
drop policy if exists "links_owner_delete" on public.links;
create policy "links_owner_delete"
  on public.links
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- =============================================================================
-- Tabela `profiles` — dados do perfil (foto, nome, @handle, bio)
-- =============================================================================
-- Um registro por usuário. Qualquer visitante pode LER (para a página pública);
-- apenas o dono autenticado pode criar/editar/excluir o próprio perfil.
-- =============================================================================

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  handle     text not null default '',
  bio        text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Qualquer visitante pode ler o perfil (página pública)
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles
  for select
  using (true);

-- O dono autenticado pode criar o próprio perfil
drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- O dono autenticado pode atualizar o próprio perfil
drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- O dono autenticado pode excluir o próprio perfil
drop policy if exists "profiles_owner_delete" on public.profiles;
create policy "profiles_owner_delete"
  on public.profiles
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- =============================================================================
-- Multiusuário — @handle único + criação automática de perfil no cadastro
-- =============================================================================
-- Cada usuário tem sua própria página pública em #/<handle>. O handle precisa
-- ser único (case-insensitive). Ao se cadastrar, um perfil é criado
-- automaticamente com um handle derivado do e-mail.
-- =============================================================================

-- Handle único (case-insensitive), ignorando vazios
create unique index if not exists profiles_handle_unique
  on public.profiles (lower(handle))
  where handle <> '';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  i int := 0;
begin
  base := regexp_replace(lower(split_part(coalesce(new.email, ''), '@', 1)), '[^a-z0-9_]', '', 'g');
  if base is null or base = '' or base = 'admin' then
    base := 'user';
  end if;

  candidate := base;
  while exists (select 1 from public.profiles where lower(handle) = candidate)
        or candidate = 'admin' loop
    i := i + 1;
    candidate := base || i::text;
  end loop;

  insert into public.profiles (user_id, name, handle)
  values (new.id, initcap(base), candidate)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- A função só deve rodar pelo trigger, nunca via API REST/RPC
revoke execute on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Storage — bucket `avatars` para as fotos de perfil (upload via câmera/galeria)
-- =============================================================================
-- Bucket público: as fotos são servidas pela URL pública. Cada usuário só pode
-- ler/enviar/substituir/excluir arquivos dentro da própria pasta (= user id).
-- A leitura pública NÃO usa policy (evita listar o bucket); a policy de SELECT
-- abaixo é restrita ao dono porque o fluxo de upload com upsert precisa dela.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- O dono autenticado pode ler os próprios arquivos (necessário para o upsert)
drop policy if exists "avatars_owner_read" on storage.objects;
create policy "avatars_owner_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- O dono autenticado pode enviar fotos para a própria pasta (prefixo = user id)
drop policy if exists "avatars_owner_insert" on storage.objects;
create policy "avatars_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- O dono autenticado pode substituir as próprias fotos
drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- O dono autenticado pode excluir as próprias fotos
drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
