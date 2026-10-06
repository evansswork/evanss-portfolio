# Fitur & pengaturan

Apa saja yang ada di halaman, saklar di `content/settings.js`, opening, dan fitur interaktif beserta file kodenya.

← [Kembali ke README](../README.md)

## Isi halaman

| Bagian | Apa yang ada |
|---|---|
| **Opening** | Default: nama raksasa "Evan." yang hurufnya menjadi jendela ke hero 3D, lalu kamera menyelam ke titiknya. Ada 3 pilihan lain — lihat [Opening](#opening-animasi-pembuka) |
| **Hero** | Tombol **View CV** (CV otomatis, bisa disimpan jadi PDF). Judul yang berganti: *Content that actually sells* → *Code that actually ships* → *Scripts that actually hook*. 7 bentuk 3D (Three.js) yang melayang, menghindari kursor, bisa di-drag, diklik untuk "pop" + konfeti, double-click = semua pop. Stiker pil bisa dilempar |
| **Strip "Worked with"** | Strip hitam di bawah hero berisi brand & tim yang pernah kamu bantu (`profile.js → marquee`) |
| **About** | Foto cutout yang "keluar" dari kartu biru dengan outline stiker, bio, daftar **Right now** (otomatis dari role yang masih berjalan), dan 4 kartu angka — **setiap angka bisa diklik ke buktinya** (case study atau role) |
| **Experience** | **Timeline** semua role dalam satu grafik (hover = detail, klik = buka role-nya, legenda = sorot satu kelompok), lalu daftar per kelompok: Petra, Brand & live commerce, Content & editing, Community & programs. Role yang masih berjalan diberi titik hijau berdenyut; foto (mis. WGG) muncul saat role-nya dibuka |
| **How I work** | Section yang di-pin saat di-scroll: Research → Hook → Edit → Measure. Layar HP berganti tiap langkah (trend radar, script dengan hook asli, timeline editing, insights 1.4M+), dan tiap langkah menaut ke case study buktinya. Di HP langkahnya bertumpuk |
| **Work** | Dua tab: *Marketing & content* dan *IT & code*. Cover asli dari portofolio, proyek IT dalam frame browser, dan cover otomatis untuk proyek tanpa gambar. Klik kartu → **case study**: role, kontribusi, hasil, **grafik batang animasi** (mis. GMV Youthentic per bulan), galeri bukti asli (bisa di-zoom), link, tombol **Copy link**, dan navigasi **case sebelumnya / berikutnya** (juga tombol ← → di keyboard). Bisa dibagikan lewat `#case-<slug>` |
| **Achievements** | Medali di rak: penghargaan, kompetisi, seleksi. Jatuh ke rak saat terlihat, berayun saat disentuh, menaut ke bukti. Slot "Best Capstone" sudah disiapkan (tersembunyi sampai kamu menyalakannya) |
| **Skills** | Dua baris kartu berlogo yang berjalan berlawanan arah (ikut ngebut saat scroll, melambat saat di-hover) + dinding stiker skill: **klik skill → panel "Where I used it"** berisi case study & role buktinya (header panel mengikuti warna stiker) |
| **Education** | Kartu sekolah, badge penghargaan (klik → PDF), daftar sertifikat (klik → PDF) |
| **Contact** | Email besar, lalu pengunjung memilih "ada perlu apa?" (hiring, freelance, collab, say hi) → tombol email & WhatsApp dengan pesan yang sudah terisi. Kartu sosial media |
| **Footer** | Nama raksasa "Evan." yang hurufnya membal saat disentuh; klik titik pink = putar ulang opening. Jam lokal Surabaya, pemilih opening |
| **CV otomatis (ATS)** | Lembar A4 dari data yang sama dengan website, format ATS: satu kolom, font standar, judul section standar (Summary, Experience, Leadership & Activities, Projects, Achievements, Education, Certifications, Skills). **Save as PDF** → 2 halaman. Link langsung: `#cv` |
| **Menu cepat** | Tekan **Ctrl+K** (Windows) / **⌘K** (Mac) atau **/** → lompat ke section, buka case study, buka link, salin email, nyalakan suara, putar ulang opening |
| Lain-lain | Tombol suara di nav, badge bulat kanan-bawah yang berputar mengikuti scroll (klik = ke atas), cursor custom, menu mobile, smooth scroll, halaman 404 bertema, gambar preview link |

**Tech:**
- **Vite** + vanilla JavaScript
- **Three.js** untuk hero 3D
- **GSAP** (ScrollTrigger, Draggable, Flip)
- **Lenis** untuk smooth scroll
- **simple-icons** untuk logo
- Web Audio untuk suara (disintesis, tanpa file)

**Performa:** ±255 KB gzip termasuk 3D. Hero 3D berhenti render saat tidak terlihat, dan `prefers-reduced-motion` dihormati (opening dilewati, animasi diperlambat).

---

## Fitur yang disesuaikan untuk recruiter (v12)

| Fitur | Cara kerja |
|---|---|
| **Hiring for** (hero) | Pengunjung memilih *Marketing* atau *Tech*. Judul dan kalimat hero, tab Work default, versi CV, serta section "How I work" (disembunyikan untuk Tech) ikut menyesuaikan. Pilihan tersimpan di URL: kirim `…/?for=tech` ke perusahaan IT dan `…/?for=marketing` ke brand. File: `src/sections/hero-focus.js` |
| **Ringkasan 5 detik** (case study) | Setiap case study dibuka dengan tiga kartu: **Role**, **Challenge**, **Outcome**. Recruiter bisa menilai dalam lima detik pertama. Data: `caseStudy.challenge` + hasil pertama di `results` |

## Saklar tanpa ngoding: `content/settings.js`

| Setting | Isi | Fungsi |
|---|---|---|
| `opening` | `'zoom'` · `'paper'` · `'slot'` · `'none'` | Animasi pembuka yang dipakai |
| `openingPicker` | `true` / `false` | Baris dev di footer: "Try openings" + "Show todos". **Set `false` sebelum link dibagikan** |
| `showTodos` | `true` / `false` | Tampilkan penanda konten yang belum diisi (garis putus-putus oranye). Default `false`: pengunjung hanya melihat yang sudah jadi |
| `siteUrl` | `'https://…'` | Alamat website setelah deploy — dicetak di CV otomatis |
| `vercelAnalytics` | `true` / `false` | Hitung pengunjung dengan Vercel Web Analytics (gratis). Aktifkan juga "Analytics" di dashboard proyek Vercel |
| `openingWord` | `'Evan'` | Kata besar di opening *zoom* |
| `openingCaptions` | `['marketing × creative × code', 'Surabaya, ID']` | Dua keterangan di pojok bawah opening *zoom* |
| `features.cursor` | `true` / `false` | Cursor custom (desktop) |
| `features.sound` | `true` / `false` | Tombol suara di nav (suara tetap mati sampai pengunjung menyalakannya) |
| `features.confetti` | `true` / `false` | Konfeti saat bentuk 3D di-pop |
| `features.velocityMarquee` | `true` / `false` | Teks berjalan ikut ngebut & berbalik arah mengikuti scroll |
| `features.wordmark` | `true` / `false` | Nama raksasa di footer |
| `features.clock` | `true` / `false` | Jam lokal di footer |
| `features.scrollBadge` | `true` / `false` | Badge bulat kanan-bawah |
| `features.headlineRotator` | `true` / `false` | Judul hero berganti-ganti (isi di `profile.js → headlines`) |
| `features.timeline` | `true` / `false` | Grafik timeline di atas daftar Experience |
| `features.composer` | `true` / `false` | Pilihan "ada perlu apa?" di Contact |
| `features.commandPalette` | `true` / `false` | Menu cepat Ctrl/⌘ K |
| `features.cvSheet` | `true` / `false` | CV otomatis (tombol hero jadi "View CV" selama file CV PDF belum ada) |
| `city`, `timezone`, `timezoneLabel` | `'Surabaya'`, `'Asia/Jakarta'`, `'WIB'` | Data jam lokal |

---

## Opening (animasi pembuka)

| Nama | Apa yang terjadi | Kesan |
|---|---|---|
| **edit** (default) | Situs dibuka seperti timeline video editing: jendela preview menampilkan hero 3D yang asli, klip **Hook → Build-up → Payoff** menempel ke track, playhead menyapu dan subtitle muncul ("Hi, I'm Evan." → "Content that actually sells." → "Code that actually ships." → "Here's the proof."), bar *Exporting* terisi mengikuti loading sungguhan, lalu jendela membesar jadi layar penuh (*final cut*). Hero muncul ±2 detik. Sekali per sesi; kunjungan berikutnya memutar versi kilat "Welcome back.". Datang lewat `?for=tech` → sisi teknis disebut lebih dulu | Personal, sinematik, langsung menjelaskan siapa kamu |
| **zoom** | Layar hitam, huruf **E-v-a-n** muncul satu per satu sebagai *jendela*: lewat huruf terlihat hero kuning dan bentuk 3D yang sedang bergerak. Titik jatuh dan memantul, lalu kamera menyelam ke dalam titik sampai layar menjadi hero, dan bentuk meluncur ke posisinya | Sinematik, tegas, langsung memperkenalkan nama |
| **paper** | Lembar kertas tinta bertuliskan nama. Lubang kecil "dipukul" di tengah, lalu empat lembar warna terbuka bergantian dengan lubang lingkaran → segi enam → pil → bintang (bentuk-bentuk hero), dengan bayangan keras | Ceria, taktil, seperti kolase kertas |
| **slot** | Kata *marketing → creative → code* bergulir seperti mesin slot, pil "Hi, I'm Evan" dibanting lalu terbang ke posisi name tag di hero | Ringan, playful |
| **none** | Langsung ke hero | Paling cepat |

**Cara membandingkan**
- Klik tombol **Try openings** di footer (kalau `openingPicker: true`).
- Atau tambahkan `?opening=paper` di URL.
- Tambahkan `?slowmo=4` untuk memutar semua animasi 4× lebih lambat — berguna untuk melihat detail.
- Klik, tekan tombol apa saja, atau scroll selama opening untuk mempercepat (skip).
- Opening penuh hanya sekali per sesi (tab browser); kunjungan berikutnya memakai versi kilat. `?opening=edit` selalu memutar versi penuh.
- Klik titik pink di nama raksasa footer untuk memutar ulang.

**Cara menambah opening baru**
1. Salin `src/openings/none.js` (paling sederhana) jadi file baru.
2. Daftarkan di `src/openings/index.js`.
3. Pakai namanya di `settings.opening`.

Detail teknis tiap opening ada di `src/openings/README.md`.

---

## Fitur interaktif

| Fitur | File | Matikan lewat |
|---|---|---|
| Hero 3D (float, hindari kursor, drag, pop, konfeti, double-click) | `src/three/hero-scene.js` | `features.confetti` (konfeti saja) |
| Stiker hero yang bisa dilempar | `src/sections/hero-stickers.js` | ubah `profile.stickers` jadi `[]` |
| Cursor custom + label (`data-cursor="Teks"` di elemen mana pun) | `src/ui/cursor.js` | `features.cursor` |
| Tombol magnetik (`data-magnetic`) | `src/ui/magnetic.js` | hapus atributnya |
| Suara UI (pop, tick, thud, open, ding) | `src/ui/sound.js` | `features.sound` |
| Marquee hidup | `src/ui/marquee.js` | `features.velocityMarquee` |
| Accordion experience | `src/sections/experience-accordion.js` | — |
| Tab work | `src/sections/work-tabs.js` | — |
| Case study modal + deep link | `src/dialogs/case-modal.js` | — |
| Lightbox screenshot bukti | `src/dialogs/lightbox.js` | — |
| Wordmark footer | `src/sections/footer-wordmark.js` | `features.wordmark` |
| Jam lokal | `src/sections/footer-clock.js` | `features.clock` |
| Badge bulat | `src/ui/badge.js` | `features.scrollBadge` |
| Pemilih opening | `src/sections/footer-picker.js` | `openingPicker` |
| Judul hero berganti | `src/sections/hero-headline.js` | `features.headlineRotator` |
| Timeline pengalaman | `src/sections/experience-timeline.js` | `features.timeline` |
| Composer kontak (email/WA terisi) | `src/sections/contact-composer.js` | `features.composer` |
| Menu cepat Ctrl/⌘ K | `src/dialogs/command-palette.js` | `features.commandPalette` |
| Tautan ke role (`data-xp`) dari angka, Right now, timeline, panel skill | `src/sections/experience-links.js` | — |
| Panel bukti skill | `src/sections/skills-evidence.js` | ubah `skills.stickers` |
| CV otomatis + cetak ke PDF | `src/dialogs/cv.js` | `features.cvSheet` |
| Sembunyikan tautan CV/PDF yang file-nya belum ada | `src/ui/files.js` | — (otomatis) |

---
