create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text default 'layout' check (icon in ('layout', 'box', 'monitor', 'sparkles')),
  sort_order integer default 0,
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.services enable row level security;

create policy "Public can read published services"
  on public.services for select
  using (status = 'published');

create policy "Admin full access services"
  on public.services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.services (title, description, icon, sort_order, status)
select * from (values
  (
    'Frontend Development',
    'Building responsive, fast, and user-friendly web interfaces with React & Next.js.',
    'layout',
    1,
    'published'
  ),
  (
    'Backend Development',
    'Developing secure APIs, databases, and server logic with Node.js and Supabase.',
    'box',
    2,
    'published'
  ),
  (
    'Full Stack Project',
    'Handling end-to-end projects from database design to web app deployment.',
    'monitor',
    3,
    'published'
  ),
  (
    'UI Implementation',
    'Translating designs into clean code with Tailwind CSS and modern components.',
    'sparkles',
    4,
    'published'
  )
) as seed(title, description, icon, sort_order, status)
where not exists (select 1 from public.services limit 1);
