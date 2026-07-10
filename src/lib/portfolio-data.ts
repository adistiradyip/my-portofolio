export const SECTION_DESC =
  "Beberapa highlight perjalanan saya sebagai developer — membangun produk digital yang bermanfaat dan berkualitas.";

export const SERVICES = [
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Membangun antarmuka web yang responsif, cepat, dan mudah digunakan dengan React & Next.js.",
    icon: "layout",
  },
  {
    id: "backend",
    title: "Backend Development",
    description:
      "Mengembangkan API, database, dan logika server yang aman menggunakan Node.js dan Supabase.",
    icon: "box",
  },
  {
    id: "fullstack",
    title: "Full Stack Project",
    description:
      "Menangani project end-to-end dari desain database hingga deployment aplikasi web.",
    icon: "monitor",
  },
  {
    id: "ui",
    title: "UI Implementation",
    description:
      "Menerjemahkan desain menjadi kode yang rapi dengan Tailwind CSS dan komponen modern.",
    icon: "sparkles",
  },
] as const;

export const ABOUT_FEATURES = [
  {
    id: "problem",
    title: "Problem Solving",
    description:
      "Suka menganalisis masalah secara mendalam dan mencari solusi yang efisien serta scalable.",
  },
  {
    id: "clean",
    title: "Clean Code",
    description:
      "Menulis kode yang terstruktur, mudah dibaca, dan mudah di-maintain untuk jangka panjang.",
  },
] as const;

export const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Sangat profesional dan komunikatif. Project selesai tepat waktu dengan kualitas kode yang rapi.",
    author: "Budi Santoso",
    role: "Project Manager",
  },
  {
    id: "t2",
    quote:
      "Memahami kebutuhan dengan cepat dan memberikan solusi teknis yang tepat. Highly recommended!",
    author: "Sarah Wijaya",
    role: "UI/UX Designer",
  },
  {
    id: "t3",
    quote:
      "Developer yang passionate dan selalu update dengan teknologi terbaru. Kerja sama sangat menyenangkan.",
    author: "Rizky Pratama",
    role: "Tech Lead",
  },
] as const;

export const BLOGS = [
  {
    id: "blog-1",
    category: "Web Dev",
    title: "Membangun Portfolio CMS dengan Next.js dan Supabase",
    author: "Saya",
    date: "Mar 2024",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
  },
  {
    id: "blog-2",
    category: "Tips",
    title: "5 Tips Menjadi Full Stack Developer di 2024",
    author: "Saya",
    date: "Feb 2024",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
  },
  {
    id: "blog-3",
    category: "Tutorial",
    title: "Belajar React Hooks dari Nol untuk Pemula",
    author: "Saya",
    date: "Jan 2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
] as const;
