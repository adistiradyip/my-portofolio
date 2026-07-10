export type Locale = "en" | "id";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Skills",
      projects: "Projects",
      testimonials: "Testimonials",
      blog: "Blog",
      contact: "Contact",
      contactCta: "Contact Me",
    },
    hero: {
      badge: "Personal Portfolio",
      greeting: "Hi, I'm",
      defaultBio:
        "I'm passionate about building modern, useful web applications. Open to freelance projects and collaborations.",
      contactMe: "Contact Me",
      downloadCv: "Download CV",
    },
    about: {
      badge: "About Me",
      title: (name: string) => `Get to Know ${name}`,
      defaultBio:
        "I'm a developer who enjoys solving problems through code. I believe good technology should be simple, fast, and easy to use.",
      features: [
        {
          id: "problem",
          title: "Problem Solving",
          description:
            "I enjoy analyzing problems deeply and finding efficient, scalable solutions.",
        },
        {
          id: "clean",
          title: "Clean Code",
          description:
            "I write structured, readable, and maintainable code for the long term.",
        },
      ],
      viewProjects: "View My Projects",
      skillsTitle: "Skills & Experience",
      emptyCms: "Add skills & experience from the admin CMS.",
    },
    services: {
      badge: "Skills",
      title: "What I Can Help With",
      description: "Areas I specialize in and frequently work on in projects.",
      empty: "No services yet. Add them from the admin CMS.",
      items: [
        {
          id: "frontend",
          title: "Frontend Development",
          description:
            "Building responsive, fast, and user-friendly web interfaces with React & Next.js.",
          icon: "layout" as const,
        },
        {
          id: "backend",
          title: "Backend Development",
          description:
            "Developing secure APIs, databases, and server logic with Node.js and Supabase.",
          icon: "box" as const,
        },
        {
          id: "fullstack",
          title: "Full Stack Project",
          description:
            "Handling end-to-end projects from database design to web app deployment.",
          icon: "monitor" as const,
        },
        {
          id: "ui",
          title: "UI Implementation",
          description:
            "Translating designs into clean code with Tailwind CSS and modern components.",
          icon: "sparkles" as const,
        },
      ],
    },
    projects: {
      badge: "Portfolio",
      title: "Projects I've Built",
      description: "A collection of personal and freelance projects I've developed.",
      all: "All",
      empty: "No published projects yet. Add them from the admin CMS.",
      fallbackDesc: "Portfolio project",
      viewDetails: "View details",
      loadMore: "Load more",
      showLess: "Show less",
      techStack: "Tech Stack",
      liveDemo: "Projects",
      viewCode: "Source Code",
      noDetails: "No additional details for this project.",
    },
    testimonials: {
      badge: "Testimonials",
      title: "What People Say About Me",
      description: "Feedback from colleagues and clients I've collaborated with.",
      empty: "No published testimonials yet. Add them from the admin CMS.",
      items: [
        {
          id: "t1",
          quote:
            "Very professional and communicative. The project was delivered on time with clean code quality.",
          author: "Budi Santoso",
          role: "Project Manager",
        },
        {
          id: "t2",
          quote:
            "Quick to understand requirements and delivers the right technical solutions. Highly recommended!",
          author: "Sarah Wijaya",
          role: "UI/UX Designer",
        },
        {
          id: "t3",
          quote:
            "A passionate developer who stays up to date with the latest tech. Great to work with.",
          author: "Rizky Pratama",
          role: "Tech Lead",
        },
      ],
    },
    stats: {
      projects: "Projects",
      title: "Ready to Bring Your Ideas to Life",
      description:
        "I'm open to freelance projects, collaborations, and full-time opportunities. Let's discuss your idea and build it together.",
      skills: "Skills Mastered",
      experience: "Work Experience",
      proficiency: "Average Skill Level",
    },
    contact: {
      badge: "Contact",
      title: "Let's Collaborate",
      description:
        "Have a project idea, need a developer, or just want to say hi? Send a message and I'll reply as soon as possible.",
      email: "Email",
      phone: "Phone",
      location: "Location",
      successTitle: "Message sent successfully!",
      successDesc: "I'll get back to you soon.",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone Number (optional)",
      messagePlaceholder: "Write your message...",
      sending: "Sending...",
      submit: "Send Message",
      subjects: {
        collaboration: "Project Collaboration",
        freelance: "Freelance",
        fulltime: "Full-time Opportunity",
        other: "Other",
      },
      formPrefix: (subject: string, phone: string) =>
        `Subject: ${subject}\nPhone: ${phone}\n\n`,
      errors: {
        spam: "Message could not be sent. Please try again.",
        rateLimit: "Too many messages sent. Please wait a few minutes.",
        validation: "Please check your name, email, and message.",
        generic: "Failed to send message. Please try again later.",
      },
    },
    blog: {
      badge: "Blog",
      title: "Articles & Notes",
      description: "Writings about web development, coding tips, and my learning journey.",
      by: "By",
      comingSoon: "Coming Soon",
      readArticle: "Read article",
      readFullArticle: "Read Full Article",
      backToBlog: "Back to all articles",
      noContent: "No content available for this article yet.",
      empty: "No published blog posts yet. Add them from the admin CMS.",
      items: [
        {
          id: "blog-1",
          category: "Web Dev",
          title: "Building a Portfolio CMS with Next.js and Supabase",
          author: "Adistira",
          date: "Mar 2024",
          image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
        },
        {
          id: "blog-2",
          category: "Tips",
          title: "5 Tips to Become a Full Stack Developer in 2024",
          author: "Adistira",
          date: "Feb 2024",
          image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        },
        {
          id: "blog-3",
          category: "Tutorial",
          title: "Learning React Hooks from Scratch for Beginners",
          author: "Adistira",
          date: "Jan 2024",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        },
      ],
    },
    footer: {
      social: "Social",
      portfolio: "Portfolio",
      contact: "Contact",
      rights: "All Rights Reserved",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      services: "Keahlian",
      projects: "Project",
      testimonials: "Testimoni",
      blog: "Blog",
      contact: "Kontak",
      contactCta: "Hubungi Saya",
    },
    hero: {
      badge: "Portfolio Pribadi",
      greeting: "Halo, Saya",
      defaultBio:
        "Saya passionate dalam membangun aplikasi web modern yang bermanfaat. Terbuka untuk project freelance dan kolaborasi.",
      contactMe: "Hubungi Saya",
      downloadCv: "Download CV",
    },
    about: {
      badge: "Tentang Saya",
      title: (name: string) => `Kenalan dengan ${name}`,
      defaultBio:
        "Saya seorang developer yang senang memecahkan masalah lewat kode. Saya percaya teknologi yang baik harus sederhana, cepat, dan mudah dipakai.",
      features: [
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
      ],
      viewProjects: "Lihat Project Saya",
      skillsTitle: "Skill & Pengalaman",
      emptyCms: "Tambahkan skills & pengalaman dari admin CMS.",
    },
    services: {
      badge: "Keahlian",
      title: "Apa yang Bisa Saya Bantu",
      description: "Beberapa area yang saya kuasai dan sering saya kerjakan dalam project.",
      empty: "Belum ada keahlian. Tambahkan dari admin CMS.",
      items: [
        {
          id: "frontend",
          title: "Frontend Development",
          description:
            "Membangun antarmuka web yang responsif, cepat, dan mudah digunakan dengan React & Next.js.",
          icon: "layout" as const,
        },
        {
          id: "backend",
          title: "Backend Development",
          description:
            "Mengembangkan API, database, dan logika server yang aman menggunakan Node.js dan Supabase.",
          icon: "box" as const,
        },
        {
          id: "fullstack",
          title: "Full Stack Project",
          description:
            "Menangani project end-to-end dari desain database hingga deployment aplikasi web.",
          icon: "monitor" as const,
        },
        {
          id: "ui",
          title: "UI Implementation",
          description:
            "Menerjemahkan desain menjadi kode yang rapi dengan Tailwind CSS dan komponen modern.",
          icon: "sparkles" as const,
        },
      ],
    },
    projects: {
      badge: "Portfolio",
      title: "Project yang Pernah Saya Kerjakan",
      description: "Kumpulan project pribadi dan freelance yang sudah saya bangun.",
      all: "Semua",
      empty: "Belum ada project yang dipublish. Tambahkan dari admin CMS.",
      fallbackDesc: "Project portfolio",
      viewDetails: "Lihat detail",
      loadMore: "Muat lebih banyak",
      showLess: "Tampilkan lebih sedikit",
      techStack: "Tech Stack",
      liveDemo: "Project",
      viewCode: "Lihat Kode",
      noDetails: "Belum ada detail tambahan untuk project ini.",
    },
    testimonials: {
      badge: "Testimoni",
      title: "Apa Kata Mereka Tentang Saya",
      description: "Feedback dari rekan kerja dan klien yang pernah berkolaborasi dengan saya.",
      empty: "Belum ada testimoni yang dipublish. Tambahkan dari admin CMS.",
      items: [
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
      ],
    },
    stats: {
      projects: "Project",
      title: "Siap Membantu Wujudkan Ide Anda",
      description:
        "Saya terbuka untuk project freelance, kolaborasi, maupun full-time opportunity. Mari diskusikan ide Anda dan kita bangun bersama.",
      skills: "Skill Dikuasai",
      experience: "Pengalaman Kerja",
      proficiency: "Rata-rata Tingkat Keahlian",
    },
    contact: {
      badge: "Kontak",
      title: "Mari Berkolaborasi",
      description:
        "Punya ide project, butuh developer, atau sekadar ingin menyapa? Kirim pesan dan saya akan membalas secepatnya.",
      email: "Email",
      phone: "Telepon",
      location: "Lokasi",
      successTitle: "Pesan berhasil dikirim!",
      successDesc: "Saya akan segera menghubungi Anda.",
      namePlaceholder: "Nama Anda",
      emailPlaceholder: "Email",
      phonePlaceholder: "Nomor Telepon (opsional)",
      messagePlaceholder: "Tulis pesan Anda...",
      sending: "Mengirim...",
      submit: "Kirim Pesan",
      subjects: {
        collaboration: "Kolaborasi Project",
        freelance: "Freelance",
        fulltime: "Full-time Opportunity",
        other: "Lainnya",
      },
      formPrefix: (subject: string, phone: string) =>
        `Subjek: ${subject}\nTelepon: ${phone}\n\n`,
      errors: {
        spam: "Pesan tidak dapat dikirim. Silakan coba lagi.",
        rateLimit: "Terlalu banyak pesan dikirim. Tunggu beberapa menit.",
        validation: "Periksa nama, email, dan pesan Anda.",
        generic: "Gagal mengirim pesan. Coba lagi nanti.",
      },
    },
    blog: {
      badge: "Blog",
      title: "Artikel & Catatan Saya",
      description: "Tulisan seputar pengembangan web, tips coding, dan pengalaman belajar saya.",
      by: "Oleh",
      comingSoon: "Segera Hadir",
      readArticle: "Baca artikel",
      readFullArticle: "Baca Artikel Lengkap",
      backToBlog: "Kembali ke semua artikel",
      noContent: "Belum ada konten untuk artikel ini.",
      empty: "Belum ada artikel yang dipublish. Tambahkan dari admin CMS.",
      items: [
        {
          id: "blog-1",
          category: "Web Dev",
          title: "Membangun Portfolio CMS dengan Next.js dan Supabase",
          author: "Adistira",
          date: "Mar 2024",
          image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
        },
        {
          id: "blog-2",
          category: "Tips",
          title: "5 Tips Menjadi Full Stack Developer di 2024",
          author: "Adistira",
          date: "Feb 2024",
          image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        },
        {
          id: "blog-3",
          category: "Tutorial",
          title: "Belajar React Hooks dari Nol untuk Pemula",
          author: "Adistira",
          date: "Jan 2024",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        },
      ],
    },
    footer: {
      social: "Sosial Media",
      portfolio: "Portfolio",
      contact: "Kontak",
      rights: "All Rights Reserved",
    },
  },
} as const;

export type Translation = (typeof translations)[Locale];
