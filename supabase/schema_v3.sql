-- NivYou: v3 schema changes
-- Run this once, in addition to schema.sql, schema_accounts.sql, and schema_v2.sql.
-- Covers: optional account profile (name/height/weight), shown in Settings.

create table if not exists user_profile (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table user_profile enable row level security;

create policy "users manage their own profile" on user_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- After running this, also run once:
--   NOTIFY pgrst, 'reload schema';
