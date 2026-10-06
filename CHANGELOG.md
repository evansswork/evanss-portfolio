# Changelog

Riwayat versi portofolio, dari yang terbaru.

## v13 — opening "The Edit"
- Opening default baru **edit**: timeline video editing (Hook → Build-up → Payoff), jendela preview berisi hero 3D asli, subtitle dari headline, export mengikuti loading sungguhan, *final cut* membesar ke layar penuh. Hero muncul ±2 detik.
- Sekali per sesi (versi kilat "Welcome back." untuk kunjungan berikutnya); skip dengan klik / tombol / scroll; subtitle mengikuti `?for=`.
- Fix: konflik CSS transition × GSAP pada transform; `THREE.Clock` (deprecated) diganti jam yang tidak melompat setelah tab disembunyikan — sekaligus memperbaiki delta waktu yang dulu selalu 16 ms; pemilih "Hiring for" ikut animasi intro hero.
- Test: opening sekali per sesi & skip dengan tombol.

## v12 — riset recruiter & HR, audit menyeluruh
- Mode **"Hiring for"** (Both / Marketing / Tech): judul & kalimat hero, tab Work, versi CV, dan section proses ikut menyesuaikan; tersimpan di URL (`?for=tech`).
- **Ringkasan 5 detik** di setiap case study: Role / Challenge / Outcome.
- **CV dua versi** (Marketing & Tech), masing-masing **1 halaman** dengan auto-fit. Tanggal lengkap bulan-tahun dari `start`/`end`, summary per versi tanpa "I", skill di atas, role dipilih berdasarkan relevansi, poin berangka diutamakan, tanpa duplikasi; opsi Full; nama file PDF otomatis.
- Konten: semua bullet diawali kata kerja dengan tense yang konsisten; kata kunci "Content strategy", "Social media marketing", "Machine learning" (dengan bukti).
- Audit: 0 pelanggaran WCAG 2.1 A/AA (axe-core) — kontras catatan kartu angka dan area scroll CV diperbaiki; CSS mati & export tak terpakai dihapus; HTML Playbook valid.
- Test: axe a11y (3 halaman) + 3 skenario baru → 25 test lolos di desktop & mobile.

## v11 — audit full-stack
- Section tidak lagi "menyatu": pita warna per section + garis pemisah; "Education & certifications" jadi satu section dengan dua sub-judul; "Skills & tools".
- Aksesibilitas: kontras WCAG AA (teks tinta di atas pink, biru digelapkan), halaman `inert` saat dialog terbuka, animasi scroll tidak lagi menyembunyikan elemen dari keyboard, Playbook tanpa pin untuk reduced motion, `<noscript>` + penutup opening dimatikan tanpa JS.
- Riwayat browser: tombol Back menutup case study / CV; link `#case-…` / `#cv` yang ditempel membuka dialog yang benar.
- SEO dari data: title, description, og:image absolut, canonical, JSON-LD, robots.txt, sitemap.xml (dari `siteUrl`); web app manifest + ikon.
- Keamanan & cache: CSP, nosniff, anti-clickjacking, Referrer/Permissions-Policy; cache aset — diuji tanpa pelanggaran.
- Build: rujukan ke file yang belum ada dibuang saat build (0 permintaan 404 di produksi).
- Kualitas: ESLint, skema tipe untuk `content/` + `npm run typecheck`, 8 test end-to-end Playwright (desktop & mobile), CI GitHub Actions, `.editorconfig`, `.nvmrc`, `engines`, lockfile ikut di-commit.
- Struktur: `src/features/` (28 file) dipecah jadi `sections/`, `dialogs/`, `ui/`; `tools/og` → `scripts/og-image`; README dipecah ke `docs/`.

## v10 — CV ATS, "How I work", Achievements
- CV otomatis ditulis ulang untuk ATS: satu kolom, Arial/Helvetica tanpa ligatur, judul section standar, kontak teks polos, skill per kategori, section Leadership & Activities, Projects tanpa duplikasi. Tetap 2 halaman; diuji dengan ekstraksi teks PDF.
- Section baru "How I work" (Research → Hook → Edit → Measure) yang di-pin saat di-scroll, dengan layar HP animasi dan tautan bukti per langkah.
- Section baru Achievements: medali di rak (Top freshman, 4× podium, Selected for DBS AI Engineer cohort) + slot Best Capstone tersembunyi.
- Strip di bawah hero: "Worked with" + nama brand.
- Pemilih poin CV mengutamakan poin dengan angka paling banyak.

## v9 — perbaikan laporan + CV otomatis
- Fix: menekan stiker skill tidak lagi membuat stiker menumpuk (fitur lempar di dinding skill dihapus); panel bukti selalu terbuka, tergulir ke layar, dan berwarna sesuai stiker.
- Fix: label timeline selalu di dalam batang (AYACO), nama pendek untuk nama panjang.
- Foto WGG dipindah dari kartu Petra ke dalam role Health Division (muncul saat dibuka).
- Fix: hero di tablet portrait memakai layout bertumpuk; atribut `hidden` selalu menang.
- Baru: CV otomatis dari `content/` yang bisa disimpan jadi PDF 2 halaman (`#cv`, Ctrl/⌘ K → View CV).
- Baru: `npm run check` — pemeriksa konten (tautan bukti, ID dobel, tanggal, file hilang, TODO).
- CapCut dihapus dari tools (tidak terverifikasi).

## v8 — setiap klaim punya bukti
- Kartu angka, stiker skill, dan daftar "Right now" menaut ke case study / role.
- Case study: Previous / Next, tombol ← →, Copy link.
- Honesty pass: detail yang tidak terverifikasi dihapus; penanda TODO disembunyikan dari pengunjung (mode "Show todos").
- Tautan CV/PDF yang file-nya belum ada disembunyikan otomatis. Skip link, marquee berhenti saat tak terlihat, opsi Vercel Analytics.

## v7 — dari template ke portofolio nyata
- Foto, mockup kampanye, dashboard GMV, grid konten, Klaviyo, dan logo diekstrak dari PDF portofolio.
- Judul hero berganti (content / code / scripts), timeline pengalaman, grafik animasi di case study, cover otomatis & frame browser, composer kontak, menu Ctrl/⌘ K.

## v6 — opening knockout + struktur folder
- Opening "zoom": hero 3D terlihat menembus huruf, kamera menyelam ke titik. Alternatif: paper, slot, none.
- Struktur `content/` · `public/` · `src/core|features|openings|three`, `settings.js`, suara, marquee kecepatan, wordmark footer, jam, gambar preview link, 404.

## v1–v5
- v5: opening slot + Flip, badge scroll, deep link case study, lightbox.
- v4: GitHub, PDF sertifikat & penghargaan.
- v3: case study modal, proyek coding, tools marquee berlogo.
- v2: tema poster kuning, hero 3D toon yang bisa di-drag & di-pop, experience per kelompok.
- v1: versi pertama (tema gelap, partikel 3D).
