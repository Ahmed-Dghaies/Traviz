# Supabase setup

1. Create a Supabase project.
2. In **SQL Editor**, run [001_supabase_setup.sql](001_supabase_setup.sql) once to create a new database, then apply every file in [migrations](migrations) in numeric order.
3. In **Authentication > URL Configuration**, add your local and production application URLs as redirect URLs.
4. In **Authentication > Providers**, enable the email provider and any OAuth providers used by the app.
5. Copy the project URL and anon key into `.env.local` as `VITE_PUBLIC_SUPABASE_URL` and `VITE_PUBLIC_SUPABASE_ANON_KEY`.

For an existing database, do not edit or rerun the bootstrap file. Run new files from [migrations](migrations) in numeric order. The current upgrade is [006_remove_activity_end_date.sql](migrations/006_remove_activity_end_date.sql), which removes the temporary activity end-date column. Activity timezones are removed by migration `005`.

After all migrations are applied, the database contains `profiles`, `trips`, `activities`, `documents`, `checklist`, and `memos`. It also creates a profile automatically whenever Supabase Auth creates a user and enables row-level security so each user can access only their own trips and their related records.

Documents are currently stored as data URLs in the `documents.url` database column. No Storage bucket is needed unless the application is changed to upload files to Supabase Storage.
