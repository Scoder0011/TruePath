-- =========================================================
-- TruePath — Initial Schema
-- Tables: paths → sub_paths → stages → resources
-- Plus: user_progress (tracks what a logged-in user completed)
-- =========================================================

-- Enable UUID generation (Supabase usually has this on already, but safe to include)
create extension if not exists "uuid-ossp";

-- =========================================================
-- 1. PATHS  (top level, e.g. Cybersecurity, Web Development)
-- =========================================================
create table paths (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'coming_soon' check (status in ('active', 'coming_soon')),
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2. SUB_PATHS  (e.g. Red Team, Blue Team under Cybersecurity)
-- =========================================================
create table sub_paths (
  id uuid primary key default uuid_generate_v4(),
  path_id uuid not null references paths(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  status text not null default 'coming_soon' check (status in ('active', 'coming_soon')),
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (path_id, slug)  -- slug must be unique within a path, not globally
);

-- =========================================================
-- 3. STAGES  (e.g. Foundations → Core Skills → Applied → Job Ready)
-- =========================================================
create table stages (
  id uuid primary key default uuid_generate_v4(),
  sub_path_id uuid not null references sub_paths(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sub_path_id, slug)
);

-- =========================================================
-- 4. RESOURCES  (individual learning items within a stage)
-- =========================================================
create table resources (
  id uuid primary key default uuid_generate_v4(),
  stage_id uuid not null references stages(id) on delete cascade,
  title text not null,
  url text not null,
  type text not null check (type in ('video', 'course', 'article', 'doc', 'practice', 'other')),
  is_free boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 5. USER_PROGRESS  (tracks completed resources per user)
-- Note: `user_id` references Supabase's built-in auth.users table
-- =========================================================
create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references resources(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, resource_id)  -- can't mark the same resource complete twice
);

-- =========================================================
-- INDEXES — speed up the lookups you'll do constantly
-- =========================================================
create index idx_sub_paths_path_id on sub_paths(path_id);
create index idx_stages_sub_path_id on stages(sub_path_id);
create index idx_resources_stage_id on resources(stage_id);
create index idx_user_progress_user_id on user_progress(user_id);
create index idx_paths_slug on paths(slug);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) — Supabase requires this to be explicit
-- =========================================================

-- Public tables: anyone can READ (paths, sub_paths, stages, resources)
alter table paths enable row level security;
alter table sub_paths enable row level security;
alter table stages enable row level security;
alter table resources enable row level security;

create policy "Public read access" on paths for select using (true);
create policy "Public read access" on sub_paths for select using (true);
create policy "Public read access" on stages for select using (true);
create policy "Public read access" on resources for select using (true);

-- user_progress: users can only see/edit their OWN progress
alter table user_progress enable row level security;

create policy "Users can view own progress" on user_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress" on user_progress
  for delete using (auth.uid() = user_id);