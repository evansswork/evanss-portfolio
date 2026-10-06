// @ts-check
// ============================================================
//  PROFILE — data diri, kontak, dan angka pencapaian
//  Edit di sini saja, semua bagian web akan ikut berubah.
// ============================================================

/** @type {import('./types').Profile} */
export const profile = {
  name: 'Evan Suryadinata S',
  firstName: 'Evan',
  lastName: 'Suryadinata',
  initials: 'ES',
  roles: ['Marketing', 'Creative', 'IT'],
  // Judul hero yang berganti-ganti. color: pink | blue | green | orange
  // focus: 'marketing' | 'tech' → dipakai saat pengunjung memilih "Hiring for" (lihat taglines di bawah)
  headlines: [
    { lead: 'Content that', punch: 'actually sells.', color: 'pink', focus: 'marketing' },
    { lead: 'Code that', punch: 'actually ships.', color: 'blue', focus: 'tech' },
    { lead: 'Scripts that', punch: 'actually hook.', color: 'green', focus: 'marketing' },
    { lead: 'Models that', punch: 'actually learn.', color: 'orange', focus: 'tech' },
  ],
  headlineInterval: 3.4, // detik per judul
  // Baris judul di CV otomatis (tombol View CV)
  cvTitle: 'Informatics student (AI Engineering) · Content strategist & video editor',
  tagline: 'Informatics student who also runs the marketing side: I build short-form systems, live commerce flows, and scripts that keep people watching — and I ship code too.',
  // Kalimat di bawah judul hero, sesuai pilihan "Hiring for" (both = belum memilih)
  taglines: {
    marketing: 'Content strategist and video editor for brands that sell on TikTok and Instagram: live commerce, short-form systems, and scripts that keep people watching.',
    tech: 'Informatics student majoring in AI Engineering: Laravel web apps, deep learning projects in Python, and a marketer\'s eye for what users actually do.',
  },

  // CV otomatis (tombol View CV): dua versi, masing-masing 1 halaman. Tulis tanpa kata ganti "I" (standar CV/ATS).
  cvVersions: {
    marketing: {
      label: 'Marketing',
      title: 'Content Strategist & Video Editor | Live Commerce | Informatics Student (AI Engineering)',
      summary: 'Content strategist and video editor working with brands on TikTok Shop live commerce, short-form video and scriptwriting since 2024. Grew TikTok Shop sales 30% in one quarter, produced reels reaching 1.4M+ views, and contributed to a 54% revenue increase (A$626K) for an Australian fashion label.',
    },
    tech: {
      label: 'Tech',
      title: 'Informatics Student (AI Engineering) | Web Development & Machine Learning Projects',
      summary: 'Second-year Informatics student majoring in AI Engineering at Petra Christian University, selected for the AI Engineer cohort of Coding Camp powered by DBS Foundation. Builds web apps with Laravel, PHP and Tailwind CSS and deep learning projects in Python, with product sense shaped by hands-on marketing and content work.',
    },
  },
  // Bahasa yang kamu kuasai, mis. ['Indonesian (native)', 'English (professional working)'] — kosong = tidak dicetak di CV
  languages: [],

  // Stiker yang bisa di-drag di hero (teks, warna: yellow | pink | blue | green | orange | ink)
  stickers: [
    { text: '1.4M views', color: 'pink' },
    { text: 'TikTok Live', color: 'blue' },
    { text: 'AI Engineer', color: 'green' },
    { text: 'Script writer', color: 'orange' },
    { text: 'Laravel + PHP', color: 'yellow' },
    { text: 'Surabaya', color: 'ink' },
  ],
  location: 'Surabaya, Indonesia',
  availability: 'Open for part-time & freelance',

  // Foto profil: taruh file di  public/images/profile/  lalu sesuaikan nama file di bawah
  photo: '/images/profile/evan.webp',
  photoCutout: true, // true = foto tanpa latar (PNG/WebP transparan) yang "keluar" dari kartu
  avatar: '', // foto kecil di name tag hero (kosong = titik hijau saja)

  // CV: taruh PDF di  public/files/cv/  lalu sesuaikan nama file di bawah
  cv: '/files/cv/Evan-Suryadinata-CV.pdf',

  bio: [
    'Second-year Informatics student at Petra Christian University, majoring in AI Engineering. I blend storytelling with sales-driven execution: TikTok campaigns, live commerce operations, and story-driven scripts built on a hook–build-up–payoff structure.',
    'I enjoy researching markets and competitors, turning insights into content angles, and building practical systems for teams — host routines, SOPs, and campaign workflows. The goal is simple: content that feels strong, stays consistent, and converts.',
  ],

  // Angka yang tampil di bagian About (counter animasi).
  // proof: kartu bisa diklik → 'case:<slug proyek>' membuka case study, 'xp:<id pengalaman>' membuka role-nya
  stats: [
    { value: 1.4, suffix: 'M+', decimals: 1, label: 'views on a single reel', note: 'Stimuler, 2026', proof: 'case:stimuler' },
    { value: 626, prefix: 'A$', suffix: 'K', decimals: 0, label: 'revenue contributed', note: 'Natasha Gan, +54% period-on-period', proof: 'case:natashagan' },
    { value: 30, suffix: '%', decimals: 0, label: 'sales growth in one quarter', note: 'Youthentic Perfume, Nov–Jan', proof: 'case:youthentic' },
    { value: 11, suffix: '', decimals: 0, label: 'tournaments led, 4 podium finishes', note: 'Petra Esports MLBB', proof: 'xp:petra-esports' },
  ],

  contacts: {
    email: 'evansspersonal@gmail.com',
    github: 'https://github.com/evansswork',
    whatsapp: 'https://wa.me/6281352814990',
    linkedin: 'https://www.linkedin.com/in/evansuryadinata',
    instagram: 'https://www.instagram.com/evanss06',
  },

  socials: [
    { label: 'LinkedIn', handle: '/in/evansuryadinata', href: 'https://www.linkedin.com/in/evansuryadinata' },
    { label: 'Instagram', handle: '@evanss06', href: 'https://www.instagram.com/evanss06' },
    { label: 'WhatsApp', handle: '+62 813-5281-4990', href: 'https://wa.me/6281352814990' },
    { label: 'GitHub', handle: '@evansswork', href: 'https://github.com/evansswork' },
    { label: 'Email', handle: 'evansspersonal@gmail.com', href: 'mailto:evansspersonal@gmail.com' },
  ],

  // Pilihan "ada perlu apa?" di bagian kontak → email / WhatsApp yang sudah terisi
  contactIntents: [
    { label: 'Hiring for a role', subject: 'Role opportunity for Evan', body: "Hi Evan,\n\nI'm [name] from [company]. We're hiring for [role] and your portfolio caught my eye.\n\nCould we schedule a quick call this week?\n\nThanks," },
    { label: 'Freelance project', subject: 'Freelance project', body: "Hi Evan,\n\nI have a [content / marketing / web] project I'd like your help with.\n\nWhat: \nTimeline: \nBudget: \n\nThanks," },
    { label: 'Content collab', subject: 'Content collaboration', body: "Hi Evan,\n\nI'd love to collaborate on [idea]. Here's what I have in mind:\n\n" },
    { label: 'Just saying hi', subject: 'Hi Evan!', body: 'Hi Evan,\n\n' },
  ],

  // Strip hitam di bawah hero: brand & tim yang pernah kamu bantu
  marqueeLabel: 'Worked with',
  marquee: ['Youthentic Perfume', 'Stimuler', 'Natasha Gan', 'KokoParfum', 'Digiflix ID', 'KJP Wellness', 'AYACO', 'JackArmy', 'Araulla', 'Petra Esports'],
};
