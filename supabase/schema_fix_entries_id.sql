-- NivYou: one-off defensive fix for the entries.id column type.
--
-- The app's uid() helper generates short non-UUID strings (e.g.
-- "mrs0mnzbisj1ao") as IDs, but entries.id was originally declared as
-- Postgres's strict "uuid" type, which rejects anything that isn't an
-- actual UUID -- causing every cloud save to fail with
-- "invalid input syntax for type uuid". schema_accounts.sql was fixed to
-- declare the column as text for anyone setting up fresh, but a project
-- that ran the old version needs its already-created column changed too.
--
-- Safe to run any number of times: it only alters the column if it's
-- still the old "uuid" type, and does nothing if it's already "text".
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'entries' and column_name = 'id' and data_type = 'uuid'
  ) then
    alter table entries alter column id type text using id::text;
  end if;
end $$;

-- After running this, also run once:
--   NOTIFY pgrst, 'reload schema';
