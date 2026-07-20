-- San Dauk Lay — initial schema
-- A public.profiles row mirrors each auth.users row and carries the app-level
-- fields the old Laravel `users` table had: name, role, provider, avatar.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'San Dauk Lay User',
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  provider text, -- null = email/password, 'google' = Google OAuth
  avatar text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read and update their own profile.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read every profile (used by the admin panel).
-- Uses a SECURITY DEFINER helper to avoid recursive RLS evaluation.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p where p.id = uid and p.role = 'admin'
  );
$$;

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

-- Auto-create a profile whenever a new auth user is created.
-- Role logic mirrors the old Laravel roleForEmail(): the very first account
-- (or when no admin exists yet) becomes an admin; everyone else is a user.
-- SAN_DAUK_LAY_ADMIN_EMAILS (a comma-separated GUC, optional) can force admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  has_admin boolean;
  admin_emails text;
  is_configured_admin boolean := false;
  resolved_role text;
  meta_provider text;
begin
  select exists (select 1 from public.profiles where role = 'admin') into has_admin;

  begin
    admin_emails := current_setting('app.admin_emails', true);
  exception when others then
    admin_emails := null;
  end;

  if admin_emails is not null and admin_emails <> '' then
    is_configured_admin := position(lower(new.email) in lower(admin_emails)) > 0;
  end if;

  if is_configured_admin or not has_admin then
    resolved_role := 'admin';
  else
    resolved_role := 'user';
  end if;

  meta_provider := new.raw_app_meta_data ->> 'provider';
  if meta_provider is not null and meta_provider <> 'email' then
    meta_provider := 'google';
  else
    meta_provider := null;
  end if;

  insert into public.profiles (id, name, email, role, provider, avatar)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    resolved_role,
    meta_provider,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'avatar')
  )
  on conflict (id) do update
    set name = excluded.name,
        avatar = coalesce(excluded.avatar, public.profiles.avatar),
        provider = coalesce(excluded.provider, public.profiles.provider);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
