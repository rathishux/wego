-- NivYou: account-based cloud sync for tracking data (dose/weight/glucose/
-- food/progress photos/markers). Run this in the Supabase SQL editor
-- in addition to schema.sql (which sets up the Community feature).
--
-- Requires Email OTP sign-in enabled: Authentication -> Sign In / Providers
-- -> Email -> make sure "Email OTP" / "Confirm email" is on (Email provider
-- is enabled by default; this just uses it in one-time-code mode instead of
-- password mode, no extra toggle needed on most projects).

create table if not exists entries (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('dose', 'weight', 'glucose', 'food', 'progress_photo')),
  created_at bigint not null,
  date text,
  data jsonb not null,
  inserted_at timestamptz not null default now()
);

create index if not exists entries_user_type_idx on entries (user_id, type);

create table if not exists user_markers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table entries enable row level security;
alter table user_markers enable row level security;

-- Private per-user data: only the owning user can read/write their own rows.
create policy "users manage their own entries" on entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage their own markers" on user_markers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- After running this, also run once:
--   NOTIFY pgrst, 'reload schema';
-- so the API layer picks up the new tables immediately.
