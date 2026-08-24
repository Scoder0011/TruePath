-- Stores whether a user picked "self_paced" or "staged" for a given
-- specialization. One row per (user, specialization) -- someone can be
-- staged on Pentesting and self-paced on something else at the same time.
create table if not exists public.user_learning_mode (
  user_id uuid references auth.users on delete cascade not null,
  spec_slug text not null,
  mode text not null check (mode in ('self_paced', 'staged')),
  updated_at timestamptz default now(),
  primary key (user_id, spec_slug)
);

alter table public.user_learning_mode enable row level security;

create policy "users manage own learning mode"
  on public.user_learning_mode for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
