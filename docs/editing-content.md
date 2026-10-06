# Mengedit konten

Semua teks, link, gambar, dan PDF — tanpa menyentuh kode.

← [Kembali ke README](../README.md)

## Cara mengedit konten

**Ganti foto / CV**

Taruh file di `public/images/profile/evan.jpg` dan `public/files/cv/Evan-Suryadinata-CV.pdf`, atau ubah nama file di `content/profile.js` (`photo`, `cv`).

**Ganti judul hero yang berganti-ganti**

Di `content/profile.js → headlines`, tiap judul berisi `{ lead, punch, color }`. `punch` adalah bagian yang di-highlight; warnanya `pink | blue | green | orange`. Kecepatan di `headlineInterval` (detik).

**Ubah pilihan pesan di Contact**

Di `content/profile.js → contactIntents`: `{ label, subject, body }`. `body` boleh berisi `\n` untuk baris baru; kurung siku `[nama]` sengaja dibiarkan supaya pengirim mengisinya.

**Tambah pencapaian (mis. Best Capstone)**

Di `content/achievements.js`, item Best Capstone sudah ada dengan `todo: true` — tersembunyi dari pengunjung dan tidak dicetak di CV. Begitu penghargaannya resmi: hapus `todo: true`, sesuaikan judul/tahun, dan (opsional) ganti `proof` ke sertifikatnya, mis. `'file:/files/certificates/best-capstone.pdf'`. Pencapaian baru = tambah objek `{ badge, title, issuer, year, color, proof }`. Medali dan CV ikut berubah otomatis.

**Ubah section "How I work"**

`content/playbook.js`: tiap langkah punya `title`, `lead`, `text`, `tools`, `proof` (case study bukti). `visual` menentukan layar HP (`research | hook | edit | measure`); `hookText` adalah teks yang diketik di layar Hook.

**Hubungkan angka & skill ke buktinya**

- Kartu angka (`profile.js → stats`): tambah `proof: 'case:youthentic'` (buka case study) atau `proof: 'xp:petra-esports'` (buka role).
- Stiker skill (`skills.js → stickers`): `{ label: 'Pricing', proof: ['case:youthentic', 'xp:kjp'] }`. Bisa juga `'go:#xp-timeline'` untuk menggulir ke elemen tertentu.

**Tandai yang belum selesai (TODO)**

Awali teks dengan `TODO:` (di `contributions`), beri `todo: true` (di `results`), atau tulis catatan di `caseStudy.todo`. Screenshot yang file-nya belum ada dan link dengan `href: ''` otomatis dianggap TODO. Semua itu **disembunyikan untuk pengunjung** dan hanya terlihat saat mode "Show todos" aktif (tombol di footer, atau `showTodos: true`).

**Mode "Hiring for" & ringkasan case study**

- `profile.js → headlines[].focus`: `'marketing'` atau `'tech'` — judul mana yang tampil untuk tiap pilihan.
- `profile.js → taglines.marketing / taglines.tech`: kalimat di bawah judul hero per pilihan.
- `projects.js → caseStudy.challenge`: satu kalimat masalah untuk kartu **Challenge**. Tulis faktanya saja, jangan dilebih-lebihkan.

**Tambah pengalaman**

Di `content/experience.js`, tambahkan objek ke `items` group yang sesuai:
```js
{
  id: 'nama-unik', company: 'Nama Perusahaan', role: 'Posisi', type: 'work', period: 'Jan 2027 — Present',
  location: 'Surabaya', logo: '/images/experience/nama.png',
  points: ['Apa yang dikerjakan…'], tags: ['TikTok'], link: '',
}
```
- Kata "Present" di `period` otomatis memunculkan titik hijau berdenyut.
- `start` / `end` (format `'YYYY-MM'`, `end: null` = masih berjalan) dipakai grafik timeline. Tanpa `start`, role tetap tampil di daftar tetapi tidak di grafik.
- `short`: nama pendek untuk label di timeline (mis. `'WGG'`).
- `photo` + `photoCaption` di sebuah role: polaroid yang muncul saat role itu dibuka.
- Kelompok baru = tambah objek `{ id, title, subtitle, color, items }`. Warna: `yellow | pink | blue | green | orange`.

**Isi case study proyek**

Di `content/projects.js`, setiap proyek punya `caseStudy` dengan field berikut:
- `role` dan `summary`
- `contributions[]`
- `results[]` → `{ value, label }`, tampil sebagai kartu angka
- `gallery[]` → `{ src: '/images/projects/<slug>/nama.png', caption }`, berisi screenshot bukti. Selama file belum ada, muncul kotak bertuliskan nama file yang ditunggu.
- `links[]` → `{ label, href }`. Kalau `href` kosong, tombol tampil abu-abu "soon".
- `charts[]` → grafik batang animasi: `{ title, data: [['Nov 2025', 60.99], ...], prefix: 'Rp ', suffix: 'M', decimals: 2 }`. Badge pertumbuhan dihitung otomatis dari nilai pertama ke terakhir; matikan dengan `delta: false`. `format: 'compact'` menampilkan 1.4M / 968K.

Tampilan kartu proyek diatur dengan:
- `coverStyle: 'image'` (default) — gambar `cover`. Kalau kosong atau gagal dimuat, muncul cover otomatis (poster warna `accent` dengan bentuk-bentuk hero).
- `coverStyle: 'browser'` — gambar di dalam jendela browser; isi `url` untuk teks di address bar (mis. `localhost:8000`).
- `coverStyle: 'code'` — jendela kode tanpa gambar; isi `file` untuk nama file di title bar.
- `accent`: `yellow | pink | blue | green | orange | ink`.

Proyek coding (`itProjects`) masih berisi `Replace me:` di bagian yang hanya kamu yang tahu (arsitektur model, fitur yang kamu bangun). Isi bagian itu, ganti link GitHub ke repo spesifik, lalu hapus `placeholder: true`.

**Bagikan satu case study**

`https://domainmu.com/#case-youthentic` langsung membuka modal case study tersebut.

**Sertifikat & penghargaan**

- PDF sertifikat → `public/files/certificates/` (nama sesuai `file` di `certificates.js`)
- PDF penghargaan → `public/files/education/` (sesuai `noteFile` di `education.js`)

Kosongkan field-nya kalau PDF belum ada, supaya item tidak bisa diklik.

**Tambah logo tool**

1. Cari nama brand di simpleicons.org.
2. Di `content/icons.js`, import `siNamaBrand` lalu daftarkan.
3. Pakai kuncinya di `content/skills.js`.

Brand yang tidak tersedia pakai `letter('C', '#hex', 'Nama')`.

**Ganti warna / font**

- Warna: `src/styles/tokens.css`.
- Font: Bricolage Grotesque (judul) + Instrument Sans (teks), dimuat via Google Fonts di `index.html`.

**Ganti bentuk 3D**

`src/three/hero-scene.js`, array `defs`: satu baris per bentuk `[geometry, warna, [x, y, z], ukuran]`.

**Ganti gambar preview link**

Lihat `scripts/og-image/README.md`.

---

## Aset asli dari PDF portofolio

Gambar di `public/images/` diambil dari PDF portofolio Canva (`Portfolio.pdf`) dan screenshot LinkedIn yang kamu kirim, lalu dikecilkan ke WebP (total ±1,6 MB):

| File | Sumber |
|---|---|
| `profile/evan.webp` (cutout, transparan) · `evan-avatar.webp` | Foto halaman "Hi" dan cover |
| `profile/evan-wgg.webp` | Foto saat WGG (halaman Organization) |
| `education/petra-*.webp` · `experience/youthentic.webp` · `stimuler.webp` · `digiflix.webp` | Logo dari halaman Education, Experiences, dan channel Digiflix |
| `projects/youthentic.webp` | Disusun dari tiga layar kampanye (Raffi Ahmad, foto produk, teaser AERIS) |
| `projects/youthentic/gmv-*.webp` | Screenshot dashboard TikTok Shop Nov–Jan (sumber data grafik GMV) |
| `projects/stimuler*`, `projects/natashagan*`, `projects/digiflix*` | Grid konten, dashboard Klaviyo, halaman channel |
| `projects/elite-scrim.webp` · `spaceshare.webp` | Thumbnail proyek dari halaman LinkedIn Projects |

Foto rombongan sekolah dan kampus **sengaja tidak dipakai**: berisi wajah orang lain yang tidak memberi izin tampil di website publik. Yang dipakai hanya foto kamu sendiri dan materi kerja yang sudah kamu publikasikan sebagai bukti.

Untuk mengganti gambar, timpa file dengan nama yang sama, atau ubah path-nya di `content/`. Ukuran yang disarankan: cover ≤ 1600 px lebar, screenshot bukti ≤ 1400 px, WebP/JPG ≤ 200 KB.

---

## FAQ

**Klik PDF / gambar malah 404?**
File belum ada di `public/…` atau namanya beda dengan yang ditulis di `content/`. Nama file case-sensitive.

**Gambar tidak muncul tapi tidak error?**
Memang dibuat begitu: logo diganti inisial, cover diganti placeholder bernomor, foto diganti kotak petunjuk. Cek path-nya.

**Tombol hero tertulis "View CV", bukan "Download CV"?**
Karena file CV PDF belum ada di `public/files/cv/`. Tombolnya membuka CV otomatis (bisa disimpan jadi PDF). Begitu file PDF-mu ditaruh dan di-deploy, tombolnya berubah jadi Download CV.

**Tautan sertifikat / penghargaan tidak bisa diklik?**
Disembunyikan otomatis selama PDF-nya belum ada di `public/files/…` — supaya pengunjung tidak mendarat di halaman 404.

**Gambar sudah ada di folder tapi tidak muncul?**
Cek nama file dan ekstensinya persis sama (huruf besar-kecil berpengaruh). Gambar dimuat saat bagiannya mendekati layar, jadi gulir ke bagian itu dulu.

**Opening terasa terlalu lama?**
Klik layar untuk mempercepat. Atau ganti `opening` ke `'slot'` / `'none'`. Durasi tiap opening bisa diatur di file masing-masing di `src/openings/`.

**Web terasa berat di HP lama?**
Hero 3D otomatis memakai 5 bentuk dan ukuran lebih kecil di layar < 720px. Kalau masih berat, kurangi isi `defs` di `hero-scene.js` atau matikan `features.confetti`.

**Mau versi satu file HTML tanpa hosting?**
`npm run build:single` → `dist-single/index.html`.

---

Dibangun dengan Vite, Three.js, GSAP, Lenis, simple-icons; font dari Google Fonts. Desain & kode dibuat bersama Claude; konten & data: Evan Suryadinata S.
