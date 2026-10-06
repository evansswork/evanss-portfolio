// @ts-check
// ============================================================
//  PROJECTS — dua tab: marketing/content (projects) dan IT/code (itProjects)
//
//  Kartu:
//    cover      : gambar kartu di public/images/projects/ (rasio 16:10). Kosong → cover dibuat otomatis
//    coverStyle : 'image' (default) | 'browser' (gambar dalam jendela browser) | 'code' (jendela kode, tanpa gambar)
//    accent     : warna cover otomatis — yellow | pink | blue | green | orange | ink
//    size       : 'wide' | 'normal'
//    placeholder: true → badge "details coming soon" (hapus setelah diisi)
//
//  caseStudy (modal saat kartu diklik):
//    challenge : satu kalimat masalah — tampil di ringkasan 5 detik (Role / Challenge / Outcome)
//    role, summary, contributions[], results[] ({ value, label })
//    charts[]  : grafik batang animasi → { title, data: [[label, angka], ...], prefix, suffix, decimals,
//                format: 'compact' (1.4M), delta: false (sembunyikan badge pertumbuhan), note }
//    gallery[] : BUKTI → { src: '/images/projects/<slug>/file.webp', caption }. File belum ada → disembunyikan
//    TODO      : awali teks dengan 'TODO:' atau beri todo: true → hanya tampil saat mode "Show todos" aktif
//    todo      : catatan untuk diri sendiri di case study (hanya tampil di mode "Show todos")
//    links[]   : { label, href } — href kosong → tombol abu-abu "soon"
// ============================================================

/** @type {import('./types').Project[]} */
export const projects = [
  {
    slug: 'youthentic',
    title: 'Youthentic Perfume',
    category: 'TikTok Live commerce & campaign',
    year: 'Dec 2024 — Aug 2026',
    result: '+30% sales in one quarter',
    description: 'Rebuilt the live-selling engine for a Gen Z perfume brand: host training, prime-time scheduling, flash-sale pricing from COGS, and campaigns featuring Raffi Ahmad.',
    cover: '/images/projects/youthentic.webp',
    size: 'wide',
    caseStudy: {
      challenge: 'Grow TikTok Shop sales for a young perfume brand without giving away margin.',
      role: 'Head of Sales Marketing · part-time, Jakarta',
      summary: 'Youthentic is a Gen Z perfume brand selling on TikTok Shop and Shopee. I owned marketing end to end — content direction, campaign planning, live commerce operations and the host team — reporting directly to the founder.',
      contributions: [
        'Led end-to-end campaigns and optimised TikTok content, including the Celestial Drift push with Raffi Ahmad and the AERIS launch teaser.',
        'Rebuilt TikTok Live: prime-time scheduling, live flow, promo mechanics and host performance reviews.',
        'Set flash-sale pricing with the founder based on COGS (HPP) to protect margin while pushing volume.',
        'Managed product uploads and catalogs on TikTok Shop and Shopee.',
        'Recruited the host team: screened 30+ CVs, ran interviews, wrote selling scripts and CTA structures.',
      ],
      results: [
        { value: '+30%', label: 'sales growth over the quarter (Nov → Jan)' },
        { value: 'Rp 81.6M', label: 'GMV in January 2026' },
        { value: '1,070', label: 'products sold in January' },
        { value: '30+', label: 'CVs screened for live hosts' },
      ],
      charts: [
        { title: 'TikTok Shop GMV per month', prefix: 'Rp ', suffix: 'M', decimals: 2, data: [['Nov 2025', 60.99], ['Dec 2025', 65.95], ['Jan 2026', 81.63]], note: 'From the TikTok Shop seller dashboard — screenshots in the proof section.' },
        { title: 'Products sold per month', decimals: 0, data: [['Nov 2025', 747], ['Dec 2025', 827], ['Jan 2026', 1070]] },
      ],
      gallery: [
        { src: '/images/projects/youthentic/gmv-nov-2025.webp', caption: 'TikTok Shop dashboard, Nov 2025 — GMV Rp 60.99M, 747 sold' },
        { src: '/images/projects/youthentic/gmv-dec-2025.webp', caption: 'Dec 2025 — GMV Rp 65.95M, 827 sold' },
        { src: '/images/projects/youthentic/gmv-jan-2026.webp', caption: 'Jan 2026 — GMV Rp 81.63M, 1,070 sold' },
        { src: '/images/projects/youthentic/raffi-campaign.webp', caption: 'Celestial Drift campaign content with Raffi Ahmad' },
        { src: '/images/projects/youthentic/aeris-teaser.webp', caption: 'AERIS launch teaser' },
        { src: '/images/projects/youthentic/product-shot.webp', caption: 'Product content shot' },
        { src: '/images/projects/youthentic/live-studio.webp', caption: 'TikTok Live 9.9 session with the host team' },
      ],
      links: [
        { label: 'Full case on Canva', href: '' },
        { label: 'Youthentic on TikTok', href: '' },
      ],
    },
  },
  {
    slug: 'stimuler',
    title: 'Stimuler',
    category: 'Short-form content engine',
    year: 'Feb 2026 — Present',
    result: '1.4M+ views, single reel',
    description: 'Trend-led reels across TikTok, Instagram and YouTube for an English-speaking app. 1.1M views in 30 days, 97% of reach from non-followers.',
    cover: '/images/projects/stimuler.webp',
    size: 'normal',
    caseStudy: {
      challenge: "Turn an English-speaking app's short-form channels into a steady source of reach.",
      role: 'Content Editor & Data-Driven Content Creator · remote',
      summary: 'Stimuler is an AI English-speaking coach. I run short-form video end to end — trend research, ideation, scripting, editing and publishing — across @steven.stimuler (TikTok) and @stimuler_ind (Instagram, YouTube).',
      contributions: [
        'Analysed market trends and audience insights to build data-backed hooks and content angles.',
        "Scripted and edited reels adapted to each platform's algorithm (pacing, captions, transitions).",
        'Managed scheduling, uploads and metadata (titles, captions, tags) across three platforms.',
        'Kept a consistent posting cadence and visual storytelling style.',
      ],
      results: [
        { value: '1.4M+', label: 'views on the top reel' },
        { value: '968K', label: 'views & 51K likes on one post' },
        { value: '1.1M', label: 'total views in 30 days' },
        { value: '564K', label: 'accounts reached, 97.3% non-followers' },
      ],
      charts: [
        { title: 'Top reels by views', format: 'compact', delta: false, data: [['Top reel', 1400000], ['2nd', 1200000], ['3rd', 968000]], note: 'Lower bounds from post insights (1.4M+, 1.2M+, 968K+).' },
      ],
      gallery: [
        { src: '/images/projects/stimuler/grid-1.webp', caption: 'TikTok grid — reels edited for @steven.stimuler' },
        { src: '/images/projects/stimuler/grid-2.webp', caption: 'Instagram grid, including the 1.3M-view reel' },
        { src: '/images/projects/stimuler/grid-3.webp', caption: 'Recurring formats: hooks, captions, sound design' },
        { src: '/images/projects/stimuler/insights-30d.webp', caption: 'Instagram insights — 30-day reach (add screenshot)' },
      ],
      links: [
        { label: 'TikTok @steven.stimuler', href: 'https://www.tiktok.com/@steven.stimuler' },
        { label: 'Instagram @stimuler_ind', href: 'https://www.instagram.com/stimuler_ind' },
      ],
    },
  },
  {
    slug: 'natashagan',
    title: 'Natasha Gan',
    category: 'Instagram reels for a fashion label',
    year: 'Feb — Apr 2026',
    result: 'A$626K revenue, +54%',
    description: 'Fashion reels and stories — behind the scenes, testimonials, beauty shots — that lifted organic reach to 453K views and sales 50% month-on-month.',
    cover: '/images/projects/natashagan.webp',
    size: 'normal',
    caseStudy: {
      challenge: 'Lift organic reach and sales for an Australian fashion label without paid ads.',
      role: 'Content Editor · remote, Australian fashion brand',
      summary: "Natasha Gan is an Australian womenswear label (natashagan.com.au). I edited Instagram reels and stories tailored to the brand's visual identity, feeding the social campaigns that drive its online store.",
      contributions: [
        "Edited dynamic reels and stories matching the brand's aesthetic.",
        'Produced varied formats: behind-the-scenes daily life, customer testimonials, product beauty shots.',
        'Ensured high-quality visuals and transitions that highlight products effectively.',
      ],
      results: [
        { value: 'A$626K', label: 'total revenue, Jan 26 – Feb 16 2026' },
        { value: '+54%', label: 'revenue vs previous period' },
        { value: '+50%', label: 'sales month-on-month' },
        { value: '453K', label: 'organic views, no paid ads' },
      ],
      gallery: [
        { src: '/images/projects/natashagan/klaviyo-dashboard.webp', caption: 'Klaviyo business performance — A$626,307 total revenue (+54%)' },
        { src: '/images/projects/natashagan/reels-1.webp', caption: 'Reels grid — 13.5K, 12K views' },
        { src: '/images/projects/natashagan/reels-2.webp', caption: 'Reels grid — 139K, 30.8K, 14.7K views' },
      ],
      links: [
        { label: 'Instagram @natashagan', href: 'https://www.instagram.com/natashagan' },
        { label: 'natashagan.com.au', href: 'https://natashagan.com.au' },
      ],
    },
  },
  {
    slug: 'digiflix',
    title: 'Digiflix ID',
    category: 'YouTube script writing',
    year: 'Dec 2025 — Feb 2026',
    result: '44.9K-subscriber channel',
    description: 'Long-form documentary-style scripts built on a hook–build-up–payoff structure to maximise watch time.',
    cover: '/images/projects/digiflix.webp',
    size: 'normal',
    caseStudy: {
      challenge: 'Keep viewers watching long, documentary-style videos to the end.',
      role: 'Script Writer · remote',
      summary: 'Digiflix ID is a YouTube channel (44.9K subscribers, 61 videos) retelling true-crime and war stories through film. I wrote the scripts.',
      contributions: [
        'Wrote story-driven scripts with a retention-first hook–build-up–payoff structure.',
        'Researched trending topics for accurate, compelling narratives.',
        'Built outlines and story beats to keep pacing tight and cut filler.',
        'Crafted hooks and CTAs to boost audience interaction.',
      ],
      results: [
        { value: '44.9K', label: 'channel subscribers' },
        { value: '61', label: 'videos on the channel' },
      ],
      gallery: [
        { src: '/images/projects/digiflix/channel.webp', caption: 'Digiflix ID channel — Sicario, Perang Salib, Deepwater Horizon' },
        { src: '/images/projects/digiflix/script-sample.webp', caption: 'Script sample: outline → beats → final (add screenshot)' },
      ],
      links: [{ label: 'Digiflix ID on YouTube', href: '' }],
    },
  },
  {
    slug: 'kokoparfum',
    title: 'KokoParfum',
    category: 'TikTok & Instagram editing',
    year: 'Apr 2026 — Present',
    result: 'Ongoing',
    description: "Raw footage to finished short-form: hooks, pacing, captions, sound design — in the creator's own voice.",
    cover: '',
    accent: 'orange',
    size: 'normal',
    caseStudy: {
      challenge: "Turn raw footage into retention-first videos in the creator's own voice, every week.",
      role: 'Content Editor · remote, Jakarta',
      summary: "KokoParfum is a perfume creator on TikTok and Instagram. I turn raw footage into fast-paced, retention-first videos while keeping the creator's style and branding intact.",
      contributions: ['Footage selection, hook and storytelling flow.', 'Captions, sound design, transitions and final delivery.'],
      results: [{ value: 'Weekly', label: 'content delivery since Apr 2026' }],
      gallery: [{ src: '/images/projects/kokoparfum/sample.webp', caption: 'Edited video samples (add screenshot)' }],
      links: [{ label: 'TikTok @kokoparfum', href: 'https://www.tiktok.com/@kokoparfum' }],
    },
  },
  {
    slug: 'jackarmy',
    title: 'JackArmy & Araulla',
    category: 'TikTok market analysis',
    year: 'Oct — Dec 2025',
    result: 'Live SOP & campaign playbook',
    description: 'Competitor and prime-time analysis turned into campaign mechanics, posting strategy and a cleaner live-studio workflow.',
    cover: '',
    accent: 'green',
    size: 'normal',
    caseStudy: {
      challenge: 'Find the formats, trends and posting times that fit two TikTok brands.',
      role: 'TikTok Market Analyst · Bogor',
      summary: 'Market research for two TikTok brands: which formats, trend angles and posting times fit their audience, then turned into concrete campaign concepts and live-studio SOPs.',
      contributions: [
        'Analysed prime time, competitor strategy and high-performing content patterns.',
        'Built event/campaign concepts: mechanics, promo timing, content direction.',
        'Recommended live-studio workflow and setup improvements.',
      ],
      results: [{ value: '2', label: 'brands covered' }, { value: '1', label: 'live SOP playbook delivered' }],
      gallery: [{ src: '/images/projects/jackarmy/analysis.webp', caption: 'Prime-time & competitor analysis sheet (add screenshot)' }],
      links: [{ label: 'Analysis deck', href: '' }],
    },
  },
];

// ---------- IT & CODE — dari LinkedIn (details/projects). Isi link GitHub per repo & bagian "Replace me:" ----------
/** @type {import('./types').Project[]} */
export const itProjects = [
  {
    slug: 'fair-price-finder',
    title: 'Fair Price Finder',
    category: 'AI-powered freelance pricing platform',
    year: 'Feb — Aug 2026',
    result: 'Deep learning · Coding Camp DBS',
    stack: ['Python', 'Deep Learning'],
    description: 'AI web platform that helps freelancers and clients in Indonesia estimate fair market prices for freelance services based on skills, service category and project scope.',
    cover: '',
    coverStyle: 'code',
    file: 'predict_price.py',
    accent: 'blue',
    size: 'wide',
    placeholder: true,
    caseStudy: {
      challenge: 'Freelancers and clients in Indonesia have no reliable reference for a fair price.',
      role: 'Capstone · Coding Camp powered by DBS Foundation (AI Engineer cohort) · with Gabrielle',
      summary: 'An AI-powered web platform that helps freelancers and clients in Indonesia estimate fair market prices for freelance services, based on skills, service category and project scope. Built as the capstone of the DBS Foundation Coding Camp AI Engineer cohort.',
      todo: 'Add: your part, dataset, model architecture, evaluation metric, how the model is served, and 1–2 screenshots.',
      contributions: [
        'TODO: data collection & cleaning (source, size).',
        'TODO: model architecture, training and evaluation.',
        'TODO: API / web integration and deployment.',
      ],
      results: [
        { value: '2', label: 'contributors, with Gabrielle' },
        { value: 'MAE ?', label: 'model error', todo: true },
      ],
      gallery: [
        { src: '/images/projects/fair-price-finder/home.webp', caption: 'Landing page' },
        { src: '/images/projects/fair-price-finder/predict.webp', caption: 'Price prediction result' },
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/evansswork' },
        { label: 'Live demo', href: '' },
      ],
    },
  },
  {
    slug: 'elite-scrim',
    title: 'Elite Scrim',
    category: 'Esports team & tournament platform',
    year: 'Jan — Jul 2026',
    result: 'Laravel · role-based',
    stack: ['Laravel', 'PHP'],
    description: 'Role-based esports platform that helps players discover teams, manage recruitment and coordinate scrims and tournaments.',
    cover: '/images/projects/elite-scrim.webp',
    coverStyle: 'browser',
    url: 'localhost:8000/squad',
    accent: 'ink',
    size: 'normal',
    placeholder: true,
    caseStudy: {
      challenge: 'Players need one place to find teams, manage recruitment and coordinate scrims.',
      role: 'Course project · Petra Christian University · with Allan Jeremy',
      summary: 'A role-based esports platform that helps players discover teams, manage recruitment and coordinate scrims and tournaments — dashboards for squads, applicants and moderation.',
      todo: 'Add: your role (backend / frontend / database), the features you built, the other 3 skills listed on LinkedIn, and what you learned.',
      contributions: [
        'TODO: roles & permissions.',
        'TODO: team discovery, recruitment flow, scrim scheduling.',
        'TODO: database design and migrations.',
      ],
      results: [{ value: '?', label: 'features you shipped', todo: true }],
      gallery: [
        { src: '/images/projects/elite-scrim/dashboard.webp', caption: 'Nova Squad Command dashboard and moderation view' },
        { src: '/images/projects/elite-scrim/recruitment.webp', caption: 'Recruitment flow' },
      ],
      links: [{ label: 'GitHub', href: 'https://github.com/evansswork' }, { label: 'Live demo', href: '' }],
    },
  },
  {
    slug: 'spaceshare',
    title: 'SpaceShare',
    category: 'Parking rental web platform',
    year: 'May — Jun 2026',
    result: 'Laravel · map search',
    stack: ['Laravel', 'Tailwind CSS'],
    description: 'Web platform connecting parking-space owners (hosts) with drivers looking for a spot — map search, bookings and a host dashboard.',
    cover: '/images/projects/spaceshare.webp',
    coverStyle: 'browser',
    url: 'localhost:8000/parkir',
    accent: 'green',
    size: 'normal',
    placeholder: true,
    caseStudy: {
      challenge: 'Drivers need parking spots while owners have spaces sitting unused.',
      role: 'Course project · Petra Christian University · with Allan Jeremy and Jonathan',
      summary: 'A web-based parking rental platform that connects parking-space owners (hosts) with drivers looking for a spot: drivers search on a map, hosts manage listings from a dashboard.',
      todo: 'Add: your part, how booking works, the other 3 skills listed on LinkedIn, and a booking-flow screenshot.',
      contributions: [
        'TODO: map search.',
        'TODO: host dashboard (listings, earnings).',
        'TODO: booking flow and validation.',
      ],
      results: [{ value: '2', label: 'user types: hosts and drivers' }],
      gallery: [
        { src: '/images/projects/spaceshare/map-dashboard.webp', caption: 'Map search ("Mau parkir di mana hari ini?") and host dashboard' },
        { src: '/images/projects/spaceshare/booking.webp', caption: 'Booking flow' },
      ],
      links: [{ label: 'GitHub', href: 'https://github.com/evansswork' }, { label: 'Live demo', href: '' }],
    },
  },
  {
    slug: 'portfolio-site',
    title: 'This portfolio',
    category: 'Interactive site · Three.js & GSAP',
    year: '2026',
    result: 'Vite · Vercel',
    stack: ['Vite', 'Three.js', 'GSAP'],
    description: 'The site you are looking at: a toon-shaded 3D playground, knockout-text opening, draggable stickers, a command palette and data-driven content.',
    cover: '/images/og.jpg',
    coverStyle: 'browser',
    url: 'localhost:5173',
    accent: 'pink',
    size: 'normal',
    caseStudy: {
      challenge: 'Show two very different skill sets in one place, with proof behind every claim.',
      role: 'Personal project',
      summary: 'Built with Vite and vanilla JavaScript. Three.js renders the hero shapes with a toon material and inverted-hull outlines; GSAP drives the openings, scroll reveals, draggable stickers and this modal. Every number on the site links to its proof, and all content lives in plain data files.',
      contributions: [
        'Three.js scene: float, cursor repulsion, drag-to-spin, click-to-pop with confetti.',
        'Knockout-text opening (SVG + mix-blend-mode) that zooms into the live 3D hero.',
        'Command palette (Ctrl/⌘ K), experience timeline, animated case-study charts, skill-to-evidence links.',
      ],
      results: [{ value: '~270KB', label: 'gzipped, 3D included' }, { value: '4', label: 'switchable openings' }],
      gallery: [],
      links: [{ label: 'GitHub', href: 'https://github.com/evansswork' }],
    },
  },
];

// Link "lihat semua karya" — isi dengan link Canva / LinkedIn / GitHub
/** @type {import('./types').MoreWork} */
export const moreWork = {
  label: 'See the full portfolio',
  canva: '',
  linkedin: 'https://www.linkedin.com/in/evansuryadinata/details/projects/',
  github: 'https://github.com/evansswork',
};
