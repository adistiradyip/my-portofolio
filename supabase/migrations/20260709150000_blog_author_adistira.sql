update public.blog_posts
set author = 'Adistira'
where author in ('Me', 'Saya');

alter table public.blog_posts
  alter column author set default 'Adistira';
