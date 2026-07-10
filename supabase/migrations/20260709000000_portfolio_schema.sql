-- Portfolio CMS schema

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Your Name',
  headline text default 'Full Stack Developer',
  bio text,
  avatar_url text,
  email text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  cv_url text,
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  content text,
  image_url text,
  tech_stack text[] default '{}',
  live_url text,
  github_url text,
  featured boolean default false,
  sort_order integer default 0,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'general',
  proficiency integer default 3 check (proficiency between 1 and 5),
  icon text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text,
  start_date date,
  end_date date,
  current boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Seed default profile
insert into public.profiles (full_name, headline, bio, email, location)
values (
  'Your Name',
  'Full Stack Developer',
  'Passionate developer building modern web applications with Next.js, React, and Supabase.',
  'hello@example.com',
  'Jakarta, Indonesia'
)
on conflict do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_messages enable row level security;

-- Public read policies
create policy "Public can read profile"
  on public.profiles for select
  using (true);

create policy "Public can read published projects"
  on public.projects for select
  using (status = 'published');

create policy "Public can read skills"
  on public.skills for select
  using (true);

create policy "Public can read experiences"
  on public.experiences for select
  using (true);

create policy "Anyone can send contact messages"
  on public.contact_messages for insert
  with check (true);

-- Admin policies (authenticated users)
create policy "Admin full access profiles"
  on public.profiles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access projects"
  on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access skills"
  on public.skills for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access experiences"
  on public.experiences for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');

create policy "Admin can update contact messages"
  on public.contact_messages for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin can delete contact messages"
  on public.contact_messages for delete
  using (auth.role() = 'authenticated');
