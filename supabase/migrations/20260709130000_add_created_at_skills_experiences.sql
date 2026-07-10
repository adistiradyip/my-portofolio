alter table public.skills
  add column if not exists created_at timestamptz default now();

alter table public.experiences
  add column if not exists created_at timestamptz default now();
