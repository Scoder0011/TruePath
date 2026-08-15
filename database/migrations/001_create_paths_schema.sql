create table paths (id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null, description text not null default '');
create table sub_paths (id uuid primary key default gen_random_uuid(), path_id uuid not null references paths(id) on delete cascade, title text not null, slug text not null, unique(path_id, slug));
create table stages (id uuid primary key default gen_random_uuid(), sub_path_id uuid not null references sub_paths(id) on delete cascade, title text not null, position integer not null);
create table resources (id uuid primary key default gen_random_uuid(), stage_id uuid not null references stages(id) on delete cascade, title text not null, url text not null, type text not null);

