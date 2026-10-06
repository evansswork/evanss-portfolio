# Evan Suryadinata — Portfolio Website

Website portofolio pribadi **Evan Suryadinata S** — mahasiswa Informatika (AI Engineering) di Petra Christian University yang juga mengerjakan digital marketing, live commerce, video editing, dan scriptwriting.

Satu halaman interaktif bergaya poster: opening yang dibuka seperti timeline video editing lalu *final cut* ke hero 3D, mode **"Hiring for"** (Marketing / Tech) yang menyesuaikan seluruh halaman, timeline pengalaman, section "How I work" yang di-pin, case study dengan ringkasan 5 detik, grafik, dan bukti asli, medali Achievements, **dua CV ATS satu halaman** (Marketing & Tech), dan menu Ctrl/⌘ K. Semua isi diambil dari file data di `content/`.

Live: `https://<nama-proyek>.vercel.app` ← isi setelah deploy

## Go live dalam 10 menit

1. `npm install` lalu `npm run verify` — pemeriksa konten, lint, typecheck, dan build harus lolos (peringatan dan TODO boleh).
2. `content/settings.js`: set `openingPicker: false`, isi `siteUrl` setelah tahu alamat Vercel-mu.
3. Push ke GitHub → vercel.com → **Add New Project** → pilih repo → **Deploy**.
4. Buka situsnya di HP dan laptop, klik **View CV** di hero, lalu **Save as PDF** — itu CV-mu yang selalu sinkron dengan website.
5. Bagikan link-nya. Untuk mengirim satu case study saja: `https://domainmu/#case-youthentic`.

---

## Perintah utama

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server lokal (http://localhost:5173) |
| `npm run verify` | Pemeriksa konten + lint + typecheck + build |
| `npm run test:e2e` | Test end-to-end desktop & mobile |
| `npm run build:single` | Satu file HTML untuk dikirim tanpa hosting |

Daftar lengkap: [docs/engineering.md](docs/engineering.md).

## Struktur folder

Aturan sederhana: **teks & link → `content/`**, **gambar & PDF → `public/`**, **kode → `src/`**.

```
evan-portfolio/
├── content/             ← TEKS, LINK & SAKLAR — semua isi website (lihat content/README.md)
│   ├── settings.js          opening, mode TODO, siteUrl, saklar fitur
│   ├── profile.js           nama, hero, bio, angka, kontak, brand
│   ├── experience.js        pengalaman per kelompok (timeline + daftar)
│   ├── projects.js          proyek + case study (bukti, grafik, link)
│   ├── achievements.js      penghargaan, kompetisi, seleksi
│   ├── playbook.js          4 langkah "How I work"
│   ├── skills.js · education.js · certificates.js · icons.js
│   └── types.d.ts           skema data (autocomplete + npm run typecheck)
├── public/              ← GAMBAR & PDF (path di content/ diawali "/")
│   ├── images/              profile/, experience/, education/, projects/<slug>/, og.jpg
│   ├── files/               cv/, certificates/, education/
│   ├── icons/ · site.webmanifest · favicon.svg · 404.html
├── src/                 ← KODE (lihat src/README.md)
│   ├── main.js              urutan inisialisasi
│   ├── core/                render konten, animasi scroll, smooth scroll
│   ├── sections/            perilaku per section (hero-, experience-, work-, skills-, contact-, footer-, playbook, achievements)
│   ├── dialogs/             case study, CV, menu cepat, lightbox
│   ├── ui/                  komponen global (cursor, nav, suara, toast, marquee, dialog, files…)
│   ├── openings/            animasi pembuka (zoom, paper, slot, none)
│   ├── three/               scene 3D hero
│   └── styles/              tokens, base, openings, sections, features
├── scripts/             ← ALAT BUILD
│   ├── check-content.mjs    pemeriksa konten (npm run check)
│   ├── vite-plugins.mjs     SEO dari data, buang rujukan file hilang, preview satu file
│   └── og-image/            generator gambar preview link
├── tests/               ← test end-to-end Playwright (desktop + mobile)
├── docs/                ← dokumentasi lengkap
├── .github/workflows/   ← CI: check, lint, typecheck, build, test
├── index.html · vite.config.js · vite.single.config.js · vercel.json
├── eslint.config.js · jsconfig.json · playwright.config.js · .editorconfig · .nvmrc
└── package.json · package-lock.json · CHANGELOG.md
```

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [docs/editing-content.md](docs/editing-content.md) | Mengedit teks, gambar, PDF, case study, pencapaian, TODO, FAQ |
| [docs/features.md](docs/features.md) | Isi halaman, saklar `settings.js`, opening, fitur interaktif & file-nya |
| [docs/cv-ats.md](docs/cv-ats.md) | Dua CV ATS 1 halaman: aturan HR yang dipakai, auto-fit, menyimpan PDF |
| [docs/engineering.md](docs/engineering.md) | Perintah, kualitas, test, CI, build, deploy, keamanan, SEO, aksesibilitas, performa |
| [docs/design-notes.md](docs/design-notes.md) | Catatan keputusan desain v1 → v13 |
| [CHANGELOG.md](CHANGELOG.md) | Riwayat versi |

## Checklist sebelum link dibagikan

- [ ] `content/settings.js` → `openingPicker: false`
- [ ] Foto di `public/images/profile/`, CV di `public/files/cv/`
- [ ] Screenshot bukti case study di `public/images/projects/<slug>/`
- [ ] Link Canva/TikTok/GitHub di `content/projects.js` (cari `href: ''`)
- [ ] Bagian `Replace me:` di proyek coding sudah diisi
- [ ] PDF sertifikat & penghargaan sudah ditaruh (atau field-nya dikosongkan)
- [ ] `index.html`: ganti `og:image` dan `url` di JSON-LD dengan domain Vercel-mu yang sebenarnya
- [ ] Isi `profile.js → languages` (kemampuan bahasa) supaya tercetak di CV
- [ ] Saat melamar: kirim link `…/?for=marketing` atau `…/?for=tech` sesuai lowongan, dan lampirkan CV versi yang sama
- [ ] Klik **Show todos** di footer untuk melihat semua yang belum diisi, lalu lengkapi satu per satu
- [ ] `npm run verify` lolos (dan `npm run test:e2e` kalau sempat)
- [ ] Isi `settings.siteUrl` setelah deploy (muncul di CV)
- [ ] Cek daftar tools di `content/skills.js` — TensorFlow disimpulkan dari kursus deep learning Dicoding-mu; hapus kalau tidak sesuai
- [ ] (Opsional) `vercelAnalytics: true` + aktifkan Analytics di Vercel untuk tahu siapa saja yang membuka portofoliomu
- [ ] Ganti link GitHub tiap proyek coding ke repo-nya masing-masing (sekarang masih ke profil `evansswork`)
- [ ] Tambahkan screenshot yang caption-nya masih "(add screenshot)"
- [ ] Buka di HP sekali — cek opening, hero, dan menu

---

---

Dibangun dengan Vite, Three.js, GSAP, Lenis, simple-icons; font dari Google Fonts. Desain & kode dibuat bersama Claude; konten & data: Evan Suryadinata S.
