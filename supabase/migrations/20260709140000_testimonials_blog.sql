create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  role text not null,
  sort_order integer default 0,
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text default 'Web Dev',
  author text default 'Adistira',
  excerpt text,
  content text,
  image_url text,
  external_url text,
  published_at date default current_date,
  sort_order integer default 0,
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;

create policy "Public can read published testimonials"
  on public.testimonials for select
  using (status = 'published');

create policy "Public can read published blog posts"
  on public.blog_posts for select
  using (status = 'published');

create policy "Admin full access testimonials"
  on public.testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access blog posts"
  on public.blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.testimonials (quote, author, role, sort_order, status)
select * from (values
  (
    'Very professional and communicative. The project was delivered on time with clean code quality.',
    'Budi Santoso',
    'Project Manager',
    1,
    'published'
  ),
  (
    'Quick to understand requirements and delivers the right technical solutions. Highly recommended!',
    'Sarah Wijaya',
    'UI/UX Designer',
    2,
    'published'
  ),
  (
    'A passionate developer who stays up to date with the latest tech. Great to work with.',
    'Rizky Pratama',
    'Tech Lead',
    3,
    'published'
  )
) as seed(quote, author, role, sort_order, status)
where not exists (select 1 from public.testimonials limit 1);

insert into public.blog_posts (title, slug, category, author, image_url, published_at, sort_order, status)
select * from (values
  (
    'Building a Portfolio CMS with Next.js and Supabase',
    'building-portfolio-cms-nextjs-supabase',
    'Web Dev',
    'Adistira',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    '2024-03-01'::date,
    1,
    'published'
  ),
  (
    '5 Tips to Become a Full Stack Developer in 2024',
    '5-tips-full-stack-developer-2024',
    'Tips',
    'Adistira',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    '2024-02-01'::date,
    2,
    'published'
  ),
  (
    'Learning React Hooks from Scratch for Beginners',
    'learning-react-hooks-beginners',
    'Tutorial',
    'Adistira',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    '2024-01-01'::date,
    3,
    'published'
  )
) as seed(title, slug, category, author, image_url, published_at, sort_order, status)
where not exists (select 1 from public.blog_posts limit 1);
