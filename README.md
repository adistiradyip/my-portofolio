# Portfolio CMS

Portfolio website dengan CMS admin panel, dibangun menggunakan **Next.js**, **Tailwind CSS**, **Aceternity UI**, dan **Supabase**.

## Fitur

- **Public Portfolio** — Hero, Projects, Skills, About, Contact
- **Admin CMS** — Kelola profile, projects, skills, experience, dan pesan contact
- **Supabase Auth** — Login admin terproteksi
- **Aceternity UI** — Spotlight, Background Beams, Bento Grid, Floating Navbar, Text Generate Effect
- **Row Level Security** — Data aman dengan RLS di Supabase

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Aceternity UI + shadcn/ui
- Supabase (PostgreSQL + Auth)
- TypeScript

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (atau restore project yang ada)
2. Buka **SQL Editor** dan jalankan isi file:
   `supabase/migrations/20260709000000_portfolio_schema.sql`
3. Buat user admin di **Authentication > Users > Add user**

### 3. Environment variables

Copy `.env.local.example` ke `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka:
- **Portfolio**: http://localhost:3000
- **Admin CMS**: http://localhost:3000/admin/login

## Struktur Project

```
src/
├── app/
│   ├── page.tsx              # Portfolio public
│   ├── admin/
│   │   ├── login/            # Login page
│   │   └── (dashboard)/      # CMS pages
│   └── auth/callback/        # Supabase auth callback
├── components/
│   ├── portfolio/            # Portfolio sections
│   ├── admin/                # CMS forms & managers
│   └── ui/                   # shadcn + Aceternity components
└── lib/
    ├── supabase/             # Supabase clients
    ├── actions.ts            # Server actions
    ├── queries.ts            # Data fetching
    └── types.ts              # TypeScript types
```

## Admin CMS

Setelah login, Anda bisa mengelola:

| Menu | Fungsi |
|------|--------|
| Dashboard | Ringkasan statistik |
| Profile | Nama, bio, social links |
| Projects | CRUD project (draft/published) |
| Skills | CRUD skill dengan proficiency |
| Experience | Riwayat pekerjaan |
| Messages | Pesan dari contact form |

## Menambah Aceternity Component

```bash
npx shadcn@latest add @aceternity/[component-name]
```

Contoh:

```bash
npx shadcn@latest add @aceternity/lamp
```

## License

MIT
