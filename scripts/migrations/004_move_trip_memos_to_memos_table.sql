-- Run after the previous migrations to remove the duplicate trips.memo column.
-- Existing non-empty notes are preserved in the dedicated memos table.

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
            and table_name = 'trips'
            and column_name = 'memo'
    ) then
        execute $sql$
            insert into public.memos (trip_id, memo)
            select id, memo
            from public.trips
            where memo <> ''
            on conflict (trip_id) do update
            set memo = excluded.memo,
                    updated_at = now()
        $sql$;

        alter table public.trips drop column memo;
    end if;
end;
$$;