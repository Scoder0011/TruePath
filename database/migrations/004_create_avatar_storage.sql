-- Public bucket for profile pictures. "Public" here means anyone with
-- the URL can VIEW an avatar (fine — profile pictures aren't private),
-- but the policies below still restrict who can UPLOAD/CHANGE one.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Files are stored as avatars/{user_id}/filename — this policy checks
-- the first folder segment matches the uploader's own user id, so no
-- one can overwrite someone else's picture.
create policy "users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
