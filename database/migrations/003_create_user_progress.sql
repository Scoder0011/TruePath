-- REVISED from the earlier version: tracks completed RESOURCES, not
-- whole stages. A stage counts as complete once every resource inside
-- it has been individually marked done -- computed on the frontend by
-- comparing this table against the roadmap content, not stored here.
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  path_slug text not null,
  spec_slug text not null,
  stage_id text not null,
  resource_id text not null,
  completed_at timestamptz default now(),
  unique (user_id, spec_slug, resource_id)
);

alter table public.user_progress enable row level security;

create policy "users manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_progress_user_spec_idx
  on public.user_progress (user_id, spec_slug);
