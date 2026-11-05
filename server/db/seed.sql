-- Start local development with an empty reviewer library.
--
-- This clears existing rows, so run db:reset only against your local
-- development database. Verify DATABASE_URL before running it.

TRUNCATE TABLE materials RESTART IDENTITY CASCADE;
