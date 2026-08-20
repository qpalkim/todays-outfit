insert into storage.buckets (id, name, public)
values ('outfit-photos', 'outfit-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', true)
on conflict (id) do nothing;

-- 두 버킷 모두 {user_id}/... 경로 규칙을 쓰므로 정책을 공유합니다.
create policy "Users can view own bucket objects"
  on storage.objects for select
  using (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own bucket objects"
  on storage.objects for insert
  with check (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own bucket objects"
  on storage.objects for update
  using (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own bucket objects"
  on storage.objects for delete
  using (
    bucket_id in ('outfit-photos', 'item-photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
