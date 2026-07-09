-- Steady: Face Progress Community schema
-- Run this in the Supabase SQL editor for a fresh project.
-- Requires anonymous sign-ins enabled: Authentication -> Providers -> Anonymous Sign-Ins.

create table if not exists community_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pseudonym text not null,
  avatar_seed text not null,
  created_at timestamptz not null default now()
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_url text not null,
  caption text,
  created_at timestamptz not null default now(),
  reaction_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false
);

create table if not exists community_reactions (
  post_id uuid not null references community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

-- Auto-hide a post once it collects 3 reports, pending manual review.
create or replace function community_handle_new_report()
returns trigger as $$
begin
  update community_posts
    set report_count = report_count + 1,
        hidden = (report_count + 1) >= 3
    where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_community_report_insert on community_reports;
create trigger on_community_report_insert
  after insert on community_reports
  for each row execute function community_handle_new_report();

-- Keep reaction_count in sync with community_reactions rows.
create or replace function community_handle_reaction_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update community_posts set reaction_count = reaction_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update community_posts set reaction_count = greatest(0, reaction_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_community_reaction_change on community_reactions;
create trigger on_community_reaction_change
  after insert or delete on community_reactions
  for each row execute function community_handle_reaction_change();

alter table community_profiles enable row level security;
alter table community_posts enable row level security;
alter table community_reactions enable row level security;
alter table community_reports enable row level security;

-- Profiles: everyone can read (needed to show pseudonym/avatar on posts),
-- but a user may only create/update their own row.
create policy "profiles are readable by anyone" on community_profiles
  for select using (true);
create policy "users manage their own profile" on community_profiles
  for insert with check (auth.uid() = user_id);
create policy "users update their own profile" on community_profiles
  for update using (auth.uid() = user_id);

-- Posts: visible if not hidden, or if you're the author (so you can still
-- see/delete your own hidden posts). Only the author can insert/delete.
create policy "visible posts are readable by anyone" on community_posts
  for select using (hidden = false or auth.uid() = user_id);
create policy "users create their own posts" on community_posts
  for insert with check (auth.uid() = user_id);
create policy "users delete their own posts" on community_posts
  for delete using (auth.uid() = user_id);

-- Reactions: readable by anyone (to compute counts/"reacted by me"),
-- but only the reacting user can insert/delete their own row.
create policy "reactions are readable by anyone" on community_reactions
  for select using (true);
create policy "users create their own reactions" on community_reactions
  for insert with check (auth.uid() = user_id);
create policy "users delete their own reactions" on community_reactions
  for delete using (auth.uid() = user_id);

-- Reports: a user can file their own report; nobody can read reports
-- through the app (review them from the Supabase table editor instead).
create policy "users create their own reports" on community_reports
  for insert with check (auth.uid() = user_id);

-- Storage bucket for post photos. Public read; only the owning path segment
-- (user id) may be written to.
insert into storage.buckets (id, name, public)
values ('community-photos', 'community-photos', true)
on conflict (id) do nothing;

create policy "community photos are publicly readable" on storage.objects
  for select using (bucket_id = 'community-photos');
create policy "users upload to their own folder" on storage.objects
  for insert with check (
    bucket_id = 'community-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "users delete their own photos" on storage.objects
  for delete using (
    bucket_id = 'community-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
