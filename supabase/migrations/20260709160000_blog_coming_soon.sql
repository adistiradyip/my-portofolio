alter table public.blog_posts
  add column if not exists coming_soon boolean not null default false;
