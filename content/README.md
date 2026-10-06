# content/ — semua isi website

Edit file-file ini untuk mengganti teks, link, dan pengaturan. Tidak ada kode tampilan di sini.

| File | Mengatur |
|---|---|
| `settings.js` | Opening yang dipakai, baris dev (pemilih opening + Show todos), mode TODO, analytics, saklar fitur |
| `profile.js` | Nama, headline & stiker hero, bio, 4 angka pencapaian, kontak, sosial media, path foto & CV |
| `experience.js` | Pengalaman per kelompok — judul, warna, daftar role |
| `projects.js` | Kartu proyek marketing & coding + isi case study (bukti, hasil, link) |
| `skills.js` | Kartu tools berlogo + stiker skill |
| `education.js` | Sekolah + badge penghargaan (PDF) |
| `certificates.js` | Sertifikat (PDF / link verifikasi) |
| `achievements.js` | Penghargaan, kompetisi, seleksi (medali di website + section di CV) |
| `playbook.js` | Empat langkah section "How I work" |
| `icons.js` | Daftar logo untuk `skills.js` |

Path gambar & PDF selalu diawali `/` dan merujuk ke folder `public/`, contoh: `/images/profile/evan.jpg` → `public/images/profile/evan.jpg`.

Teks yang diawali `TODO:` (atau `todo: true`) hanya tampil di mode "Show todos" — aman dibiarkan sampai kamu sempat mengisinya.

Setiap file diawali `// @ts-check` dan memakai skema di `types.d.ts`: di VS Code field yang salah ketik langsung bergaris merah. Cek semuanya dengan `npm run typecheck`, dan cek tautan bukti/ID/tanggal dengan `npm run check`.
