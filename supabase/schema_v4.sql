-- NivYou: v4 schema changes
-- Run this once, in addition to schema.sql, schema_accounts.sql, schema_v2.sql,
-- and schema_v3.sql.
-- Covers: waist/sleep/mood progress markers moved from a single overwritable
-- snapshot (the old user_markers table) into dated history rows in the
-- shared "entries" table, alongside dose/weight/glucose/food.

alter table entries drop constraint if exists entries_type_check;
alter table entries add constraint entries_type_check
  check (type in ('dose', 'weight', 'glucose', 'food', 'marker', 'progress_photo', 'you_post'));

-- user_markers is no longer written to by the app. It's left in place (and
-- still cleared by account deletion) so any pre-existing snapshot isn't
-- silently orphaned; safe to drop manually once you've confirmed no data
-- you care about is left in it:
--   drop table if exists user_markers;

-- After running this, also run once:
--   NOTIFY pgrst, 'reload schema';
