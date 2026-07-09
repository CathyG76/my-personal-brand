-- my-personal-brand — initial schema
-- Core objects:
--   posts  — the content the owner publishes and visitors read
--   leads  — visitor sign-ups the sales team tracks
--
-- Access model (only the anon key is provisioned — no service-role key):
--   * Public (anon) can SELECT published posts and INSERT leads (the capture form).
--   * The signed-in owner (authenticated) has full CRUD on posts and leads.
--     Admin pages/actions run under the owner's session, so RLS lets them through.

create extension if not exists pgcrypto;

-- ── posts ───────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null default '',
  body         text not null default '',
  cover_emoji  text not null default '📝',
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

-- ── leads ───────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  name           text not null default '',
  email          text not null,
  message        text not null default '',
  status         text not null default 'new',   -- new | contacted | won | archived
  source_slug    text,                           -- slug of the post they came from
  source_post_id uuid references public.posts (id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- keep updated_at fresh on posts
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.posts enable row level security;
alter table public.leads enable row level security;

-- Anyone may read PUBLISHED posts.
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select using (published = true);

-- The signed-in owner has full control over posts (incl. drafts).
drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all to authenticated using (true) with check (true);

-- Anyone may submit a lead (the capture form).
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated with check (true);

-- The signed-in owner has full control over leads (read inbox, update status, delete).
drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all" on public.leads
  for all to authenticated using (true) with check (true);

-- ── seed (demo placeholders the owner can also edit/delete) ───────────────────
insert into public.posts (title, slug, excerpt, body, cover_emoji, published, published_at)
values
  (
    'Welcome to my corner of the internet',
    'welcome',
    'Why I built a site I actually own — instead of renting an audience on someone else''s platform.',
    E'I got tired of pouring work into platforms that could change the rules overnight.\n\nThis site is mine. I publish here first, I own the audience, and I control the experience end to end.\n\nIf something here resonates, drop me your email at the bottom — I read every note.',
    '👋',
    true,
    now() - interval '3 days'
  ),
  (
    'How I think about building in public',
    'building-in-public',
    'Sharing the messy middle, not just the polished wins.',
    E'Building in public isn''t about broadcasting highlights. It''s about narrating the decisions.\n\nHere''s the loop I run every week:\n\n1. Ship one small thing.\n2. Write down what I learned.\n3. Ask the people reading what they''d try next.\n\nThat third step is where the leads — and the friendships — come from.',
    '🛠️',
    true,
    now() - interval '1 day'
  ),
  (
    'Draft: my 2026 content roadmap',
    'content-roadmap-2026',
    'Still cooking — not published yet.',
    E'This one is a work in progress. Themes I''m considering:\n\n- A teardown series\n- Monthly income + metrics reports\n- A short course\n\nComing soon.',
    '🗺️',
    false,
    null
  )
on conflict (slug) do nothing;

insert into public.leads (name, email, message, status, source_slug)
select 'Sample Visitor', 'sample.lead@example.com', 'Loved the welcome post — would love to chat.', 'new', 'welcome'
where not exists (select 1 from public.leads where email = 'sample.lead@example.com');
