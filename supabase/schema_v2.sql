-- Steady: v2 schema changes
-- Run this once, in addition to schema.sql and schema_accounts.sql.
-- Covers: the new private "You" timeline, optional photos on Community
-- posts (text-only posts), and Community comments.

-- 1. Let the "entries" table (used by the private You timeline, plus
--    dose/weight/glucose/food/progress photos) accept the new "you_post" type.
alter table entries drop constraint if exists entries_type_check;
alter table entries add constraint entries_type_check
  check (type in ('dose', 'weight', 'glucose', 'food', 'progress_photo', 'you_post'));

-- 2. Community posts no longer require a photo (text-only updates allowed).
alter table community_posts alter column photo_url drop not null;

-- 3. Track how many comments a post has, kept in sync by trigger below.
alter table community_posts add column if not exists comment_count int not null default 0;

-- 4. Comments themselves.
create table if not exists community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  report_count int not null default 0,
  hidden boolean not null default false
);

create index if not exists community_comments_post_idx on community_comments (post_id);

create table if not exists community_comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references community_comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

alter table community_comments enable row level security;
alter table community_comment_reports enable row level security;

create policy "visible comments are readable by anyone" on community_comments
  for select using (hidden = false or auth.uid() = user_id);
create policy "users create their own comments" on community_comments
  for insert with check (auth.uid() = user_id);
create policy "users delete their own comments" on community_comments
  for delete using (auth.uid() = user_id);

create policy "users create their own comment reports" on community_comment_reports
  for insert with check (auth.uid() = user_id);

-- Auto-hide a comment once it collects 3 reports, same pattern as posts.
create or replace function community_handle_new_comment_report()
returns trigger as $$
begin
  update community_comments
    set report_count = report_count + 1,
        hidden = (report_count + 1) >= 3
    where id = new.comment_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_community_comment_report_insert on community_comment_reports;
create trigger on_community_comment_report_insert
  after insert on community_comment_reports
  for each row execute function community_handle_new_comment_report();

-- Keep community_posts.comment_count in sync with community_comments rows.
create or replace function community_handle_comment_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update community_posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update community_posts set comment_count = greatest(0, comment_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_community_comment_change on community_comments;
create trigger on_community_comment_change
  after insert or delete on community_comments
  for each row execute function community_handle_comment_change();

-- After running this, also run once:
--   NOTIFY pgrst, 'reload schema';
