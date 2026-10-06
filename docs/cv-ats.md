# CV otomatis (format ATS, 1 halaman)

← [Kembali ke README](../README.md)

Tombol **View CV** membuka CV yang dibuat langsung dari `content/`. Ada dua versi dan dua panjang:

| | Isi di bagian atas | Untuk melamar |
|---|---|---|
| **Marketing** (`#cv`) | Summary → Skills → Experience | Content, social media, digital marketing, live commerce |
| **Tech** (`#cv-tech`) | Summary → Skills → Projects → Education | Software, web, AI/ML, internship IT |

**1 page** (default) memadatkan CV supaya muat satu halaman A4. **Full** menampilkan semuanya (±2 halaman).
Tombol hero otomatis membuka versi yang sesuai pilihan "Hiring for" pengunjung.

## Menyimpan jadi PDF
Klik **Save as PDF** → di dialog Print pilih *Save as PDF* → Save. Nama file sudah terisi rapi (`Evan-Suryadinata-CV-Marketing` / `-Tech`).

## Aturan ATS & HR yang dipakai
Berdasarkan panduan rekrutmen 2026:
- **Satu kolom**, judul section standar (Summary, Skills, Experience, Projects, Achievements, Leadership & Activities, Education, Certifications). Layout dua kolom bisa membuat urutan teks teracak saat dibaca mesin.
- **Font standar** (Arial/Helvetica) 9,5–10 pt tanpa ligatur. Tidak pernah di bawah 9 pt.
- **Kontak teks polos**: email | telepon | LinkedIn | GitHub | website | kota.
- **Tanggal lengkap**: `Mon YYYY – Mon YYYY`, atau `Present` hanya untuk role yang masih berjalan. Dihitung dari `start`/`end` di `experience.js`, jadi tidak ada lagi "Jul – Aug 2026" yang bulan awalnya tanpa tahun.
- **Summary 2–3 baris per versi**, tanpa kata ganti "I", dengan angka pencapaian (`profile.js → cvVersions`).
- **Skills dekat bagian atas**, dikelompokkan supaya cocok dengan pencocokan kata kunci.
- **Bullet diawali kata kerja**; role yang masih berjalan memakai present tense.
- **1 halaman untuk early-career.**
- **Tidak ada duplikasi**: penghargaan hanya muncul di Achievements; proyek yang sudah jadi role tidak diulang di Projects.

## Cara auto-fit 1 halaman bekerja
CV dirender di elemen tersembunyi selebar halaman cetak. Kalau lebih dari satu halaman, detail dikurangi bertahap, dimulai dari bagian pendukung:
1. Poin di Leadership & Activities dan Projects dihilangkan; keduanya diringkas jadi satu paragraf.
2. Soft skills dihapus, lalu baris skill di luar fokus versi (Technical di versi Marketing, Marketing di versi Tech).
3. Projects dihapus (khusus versi Marketing).
4. Jumlah role yang dirinci dikurangi. Yang dipertahankan adalah role **paling relevan** — skor dari jumlah angka pencapaian, senioritas (Head/Lead), dan durasi — tetap ditampilkan berurutan dari yang terbaru. Sisanya pindah ke baris "Additional experience".
5. Langkah terakhir: ukuran huruf 9,5 pt dan satu poin per role. Kalau poinnya dibatasi satu, yang dipilih adalah poin yang **berisi angka**.

Hasil saat ini:
- **Marketing**: Stimuler, Youthentic, dan Natasha Gan dirinci dengan poin berangka.
- **Tech**: tiga proyek coding dirinci, pengalaman marketing diringkas.

Menambah pengalaman tidak akan membuat CV meluber ke halaman 2.

## Mengubah isi
- Judul & summary per versi: `content/profile.js → cvVersions`.
- Bahasa: `profile.js → languages` (mis. `['Indonesian (native)', 'English (professional working)']`) — dicetak di Skills kalau diisi.
- Sekolah yang tidak perlu dicantumkan: `inCV: false` di `education.js`.
- Punya CV PDF buatan sendiri? Taruh di `public/files/cv/` (sesuai `profile.cv`); tombol hero kembali jadi **Download CV**.
