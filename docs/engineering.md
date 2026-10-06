# Engineering

Perintah, pemeriksaan kualitas, test, build, deploy, keamanan, SEO, aksesibilitas, dan performa.

← [Kembali ke README](../README.md)

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server lokal di http://localhost:5173, perubahan langsung terlihat |
| `npm run check` | Pemeriksa konten (tautan bukti, ID dobel, tanggal, file hilang, TODO) |
| `npm run lint` | ESLint untuk `src/`, `content/`, `scripts/`, `tests/` |
| `npm run typecheck` | Cek tipe file `content/` terhadap skema `content/types.d.ts` |
| `npm run build` | Build produksi ke `dist/` (pemeriksa konten jalan otomatis lebih dulu) |
| `npm run preview` | Menyajikan hasil build di http://localhost:4173 |
| `npm run test:e2e` | Test end-to-end Playwright, desktop + mobile (pertama kali: `npx playwright install chromium`) |
| `npm run verify` | check + lint + typecheck + build sekaligus — jalankan sebelum push |
| `npm run build:single` | Satu file HTML berisi semuanya (`dist-single/`), untuk dikirim tanpa hosting |
| `npm run og` | Membuat ulang gambar preview link (`public/images/og.jpg`) |

Butuh Node.js 20.19+ (versi yang dipakai CI ada di `.nvmrc`).

## Pemeriksaan kualitas

- **Pemeriksa konten** (`scripts/check-content.mjs`): error untuk tautan bukti ke case/role yang tidak ada, ID atau slug dobel, dan format tanggal salah. Peringatan untuk CV yang belum ada dan `openingPicker` yang masih menyala. TODO untuk screenshot, PDF, dan link yang belum diisi.
- **ESLint** (`eslint.config.js`): aturan `recommended` + `no-unused-vars`, `eqeqeq`, `prefer-const`.
- **Type-check konten**: setiap file di `content/` diawali `// @ts-check` dan diberi tipe dari `content/types.d.ts`. Di VS Code, field yang salah ketik langsung bergaris merah dan autocomplete muncul. `npm run typecheck` memeriksa semuanya dari terminal.
- **Test aksesibilitas** (`tests/a11y.spec.js`): axe-core memeriksa aturan WCAG 2.1 A/AA di halaman, case study, dan CV — desktop & mobile. Audit terakhir: 0 pelanggaran.
- **Test end-to-end** (`tests/smoke.spec.js`, 10 skenario × desktop & mobile):
  - opening selesai tanpa error konsol;
  - tidak ada scroll ke samping;
  - case study bisa dibuka, pindah ke case berikutnya, ditutup dengan tombol Back, dan dibuka dari link `#case-…`;
  - halaman di belakang dialog menjadi `inert`;
  - penanda TODO tersembunyi dan hanya medali yang sudah resmi yang tampil;
  - panel bukti skill terbuka;
  - kedua versi CV memakai judul section ATS, tanggal bulan-tahun lengkap, dan summary tanpa "I";
  - mode "Hiring for" menyesuaikan halaman dan tersimpan di URL;
  - case study dibuka dengan ringkasan Role / Challenge / Outcome;
  - menu Ctrl+K berfungsi.
- **CI** (`.github/workflows/ci.yml`): setiap push dan pull request menjalankan `npm ci`, pemeriksa konten, lint, typecheck, build, dan test e2e. Kalau ada yang gagal, GitHub menandainya merah sebelum perubahan sampai ke Vercel.

## Build

Plugin di `scripts/vite-plugins.mjs`:
- `siteMeta()` — title, description, `og:image` absolut, canonical, JSON-LD (Person), konten `<noscript>`, `robots.txt`, dan `sitemap.xml`. Semuanya diambil dari `content/profile.js` dan `settings.siteUrl`, jadi tidak ada lagi HTML yang perlu diedit manual. Isi `siteUrl` setelah tahu alamat Vercel-mu.
- `stripMissingAssets()` — saat build, rujukan ke gambar/PDF yang belum ada dikosongkan dari data, jadi produksi tidak pernah meminta file yang 404. Mode dev tidak terpengaruh.
- `inlinePublicImages()` — khusus `build:single`: gambar ditanam sebagai data URI.

Three.js, GSAP, dan Lenis dipisah ke chunk sendiri supaya cache browser bertahan saat konten berubah.

## Deploy (Vercel)

1. Push ke GitHub (lockfile `package-lock.json` ikut di-commit supaya build reproducible).
2. vercel.com → **Add New Project** → pilih repo → **Deploy**. Setting build diambil dari `vercel.json`.
3. Setelah tahu alamatnya: isi `settings.siteUrl`, push lagi.

## Keamanan

`vercel.json` memasang header untuk semua halaman:
- **Content-Security-Policy**: skrip hanya dari domain sendiri; style dan font hanya dari domain sendiri dan Google Fonts; tidak bisa di-embed di iframe situs lain.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, dan `Permissions-Policy` (kamera, mikrofon, lokasi dimatikan).
- Cache: `/assets/*` (nama file ber-hash) di-cache setahun; `/images/*` seminggu.

Sudah diuji dengan menyajikan hasil build memakai header persis ini dan memicu semua fitur: tidak ada pelanggaran CSP. Kalau suatu saat menambah skrip pihak ketiga (mis. analytics lain), domainnya perlu ditambahkan ke CSP.

## SEO & berbagi link

- `og:image` 1200×630 (`public/images/og.jpg`) dengan URL absolut dari `siteUrl` — syarat agar preview muncul di LinkedIn/WhatsApp.
- JSON-LD Person dan canonical URL.
- Web app manifest + ikon (`public/site.webmanifest`, `public/icons/`) untuk "Add to Home Screen".

## Aksesibilitas

- **Kontras WCAG AA**: teks di atas pink memakai tinta (6,3:1); biru digelapkan supaya teks putih 5,2:1.
- **Dialog**: saat case study, CV, menu cepat, atau lightbox terbuka, halaman di belakangnya `inert` (tidak terjangkau Tab, diabaikan screen reader). Fokus kembali ke elemen pemicu saat ditutup.
- **Animasi scroll** tidak pernah menyembunyikan elemen dari keyboard: elemen hanya transparan dan langsung tampil saat difokus.
- **Reduced motion**: opening dilewati, section "How I work" tidak di-pin (langkah bertumpuk), marquee melambat.
- Skip link, fokus terlihat, `<noscript>` berisi ringkasan dan kontak (penutup opening juga dimatikan tanpa JavaScript).

## Performa

- ±280 KB gzip termasuk 3D. Hero 3D berhenti render saat tidak terlihat; marquee berhenti saat di luar layar.
- Gambar WebP, dimuat saat bagiannya mendekati layar; tidak ada permintaan 404 di produksi.
- Font dari Google Fonts dengan `preconnect` dan `display=swap`.

