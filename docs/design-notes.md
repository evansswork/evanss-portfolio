# Catatan desain

Kenapa situs ini seperti sekarang — keputusan dari v1 sampai v11.

← [Kembali ke README](../README.md)

## Catatan eksplorasi desain

Ringkasan keputusan, supaya kamu tahu kenapa situs ini seperti sekarang.

**Tema**

Versi pertama gelap-elegan (krem di atas hitam) terasa terlalu serius untuk seseorang yang kerjanya di konten dan TikTok. Diganti ke poster kuning dengan stiker, outline tebal, dan hard shadow — ceria tapi tetap terstruktur.

**Opening**

Ada empat iterasi:
1. Counter 0–100 → terlalu generik.
2. Bentuk melompat + kata → terasa lemah.
3. Tirai warna + huruf-tile → masih terasa sebagai "layar terpisah".
4. Slot + Flip → lebih menyatu, tapi kurang memukau.

Pola preloader yang umum (bar bertumpuk, marquee teks, reveal per huruf) terlalu sering dipakai. Opening *zoom* memakai teknik **knockout text**: lapisan hitam murni + huruf putih dengan `mix-blend-mode: multiply`. Hasilnya, putih jadi tembus dan hitam tertutup, sehingga hero 3D yang sedang bergerak terlihat *di dalam* nama. Opening tidak lagi menutupi situs — ia memperlihatkannya.

Dua jebakan teknis yang ditemukan saat membangunnya:
- Blend mode harus dipasang di wadah terluar, karena elemen `position: fixed` membuat *stacking context* sendiri.
- Warnanya harus hitam murni (`#000`), bukan tinta `#16140f`, supaya bentuk di belakang tidak membayang.

**Footer**

Nama raksasa "Evan." menutup halaman dengan bentuk yang sama seperti pembukanya. Titik pink di footer juga yang memutar ulang opening.

**Suara**

Suara disintesis langsung di browser (0 KB) dan **mati secara default**, sehingga tidak pernah mengejutkan pengunjung.

**Upgrade v7: dari template ke portofolio nyata**

Kekurangan terbesar versi sebelumnya bukan animasinya, tapi isinya: hampir semua visual masih placeholder. Materi yang sudah ada di PDF portofolio (foto, mockup kampanye, dashboard GMV, grid konten, Klaviyo) diekstrak dan dipasang, sehingga setiap angka di case study sekarang punya bukti di sebelahnya.

Grafik hanya memakai angka yang terbaca langsung dari screenshot (GMV dan produk terjual per bulan, views reel teratas). Tidak ada angka turunan atau perkiraan.

Judul hero kini menunjukkan ketiga sisi (marketing, code, scripts), karena versi sebelumnya hanya bicara soal marketing padahal kamu mahasiswa IT. Menu Ctrl/⌘ K dan frame browser `localhost:8000` adalah sinyal kecil untuk recruiter teknis.

Pelajaran teknis: gambar yang memakai `loading="lazy"` sekaligus disembunyikan (`display:none`) sampai selesai dimuat tidak akan pernah dimuat browser. Loader gambar sekarang menunggu bagian halamannya mendekati layar, lalu memuat tanpa atribut lazy.

**Upgrade v8: setiap klaim punya bukti, tidak ada yang palsu atau setengah jadi**

- Angka di About, stiker skill, dan daftar "Right now" kini menaut ke case study atau role yang membuktikannya. Recruiter tidak perlu percaya begitu saja — tinggal klik.
- *Honesty pass*: detail yang sebelumnya kukarang dihapus (MySQL di Elite Scrim, "3 user roles"). Proyek IT hanya memuat fakta dari LinkedIn-mu; sisanya ditandai TODO.
- Penanda belum-selesai ("TODO", screenshot yang belum ada, link "soon") **tidak pernah terlihat oleh pengunjung**, kecuali kamu menyalakan mode Show todos.
- Tombol Download CV dan tautan PDF diperiksa saat halaman dibuka; kalau file-nya belum ada, tautannya disembunyikan otomatis sehingga tidak ada yang mendarat di halaman 404.
- Case study bisa dijelajahi berurutan (Previous / Next, tombol ← →) dan punya tombol Copy link untuk dibagikan.
- Avatar di name tag hero dihapus atas permintaanmu (fiturnya tetap ada: isi `profile.avatar` kalau suatu saat mau).

**Versi final (v9): perbaikan yang kamu laporkan + CV otomatis**

- *Skill "numpuk" saat ditekan*: penyebabnya fitur lempar stiker. Di trackpad, tekanan kecil sering bergeser beberapa piksel dan terbaca sebagai lemparan, jadi stiker bergeser menimpa tetangganya dan panel tidak terbuka. Fitur lempar di dinding skill dihapus; sekarang klik selalu membuka panel, panel otomatis tergulir ke layar, dan warna header mengikuti stiker.
- *Label AYACO keluar dari batang*: semua label sekarang selalu di dalam batang, dengan nama pendek (`short`) untuk nama yang panjang.
- *Foto di kartu Petra*: dihapus; foto WGG pindah ke dalam role Health Division dan muncul saat role itu dibuka.
- Ditemukan saat QA: di tablet portrait teks hero menimpa bentuk 3D → sekarang memakai layout bertumpuk seperti HP. Atribut `hidden` kalah oleh `display` dari kelas tertentu (tombol "Download PDF" palsu sempat muncul) → diperbaiki secara global.
- Baru: **CV otomatis** yang bisa disimpan jadi PDF 2 halaman, dan **`npm run check`** untuk memeriksa konten sebelum deploy.
- CapCut dihapus dari daftar tools karena tidak terverifikasi.

**v10: CV ATS, "How I work", Achievements**

- Bagian tengah situs sebelumnya masih pola standar (list → grid → list). Yang belum ada adalah cerita *cara kamu berpikir* — itu yang membedakan content strategist dari editor biasa. Section "How I work" di-pin saat di-scroll dan tiap langkahnya menaut ke case study, jadi prosesnya juga punya bukti.
- Achievements dipisah dari angka performa di About: penghargaan dan seleksi adalah jenis bukti yang berbeda dari views atau omzet.
- Strip di bawah hero kini berisi nama brand, bukan daftar skill — bukti sosial langsung setelah kesan pertama.
- CV ditulis ulang untuk ATS (lihat bagian CV otomatis).

**Yang sengaja tidak ditambahkan**

Dark mode (kuning adalah identitasnya), cursor trail, dan animasi hover di semua elemen — itu arah yang membuat situs terasa generik.

---

**v11: audit full-stack**

- *Section yang "menyatu"*: Achievements, Skills, dan Education berurutan di latar yang sama. Sekarang tiap section punya permukaan sendiri (biru muda → pink muda → krem → hijau muda → tinta) dengan garis pemisah, dan "Education & certifications" menjadi satu section dengan dua sub-judul.
- *Kontras*: teks putih di atas pink hanya 2,85:1 (gagal WCAG AA) — teks di atas pink sekarang tinta (6,3:1); biru digelapkan sedikit (#3d6bff → #2f5cf0) supaya teks putih 5,2:1.
- *Animasi "muncul saat di-scroll"* dulu memakai `visibility: hidden`, sehingga pengguna keyboard melompati kartu yang belum ter-scroll. Sekarang hanya transparan dan langsung tampil saat difokus. Test otomatis yang menemukan masalah ini.
- *Riwayat browser*: membuka case study menambah entri riwayat — tombol Back menutup modal alih-alih meninggalkan situs, dan link `#case-…` yang ditempel membuka case yang benar.


**v12: riset recruiter & HR**

- Riset 2026: recruiter memutuskan dalam ±5–10 detik pertama, dan portofolio dengan dua identitas bisa membingungkan soal peran yang dilamar. Jawabannya bukan memilih satu identitas, tapi **mode "Hiring for"** — satu situs, dua tampilan, dengan link yang bisa dikirim sesuai lowongan.
- Case study yang baik menjawab peran, masalah, dan hasil di layar pertama → **ringkasan 5 detik** (Role / Challenge / Outcome) sebelum cerita lengkapnya.
- CV dinilai ulang dari sisi HR: tanggal yang bulannya tanpa tahun, summary dengan "I", 2 halaman untuk kandidat early-career, dan duplikasi penghargaan — semuanya diperbaiki. Sekarang ada dua versi 1 halaman yang memilih role paling berdampak.
- Audit otomatis menyeluruh: CSS mati dihapus, export tak terpakai dibersihkan, `<ol>` yang tidak valid di Playbook diperbaiki, dan dua pelanggaran WCAG dari axe-core (kontras catatan kartu angka, area scroll CV yang tak terjangkau keyboard) dibereskan.

**v13: opening "The Edit"**

- Opening "zoom" secara teknik bagus, tapi pesannya generik (huruf "Evan" yang memantul), ±3 detik, dan diputar ulang setiap kunjungan.
- Riset: preloader layar penuh menunda LCP. Rekomendasinya: di bawah 2 detik, bisa dilewati, tanggap terhadap loading sungguhan, dan hanya sekali per sesi. Referensi terbaik menjadikan loader bagian dari situs itu sendiri.
- Konsep baru menceritakan keahlianmu: timeline editing dengan struktur hook → build-up → payoff yang memang kamu pakai, subtitle dari headline di data, dan export yang mengikuti loading sungguhan. *Final cut*-nya adalah situsmu — jendela preview selalu menampilkan hero asli, jadi transisinya tanpa potongan.
