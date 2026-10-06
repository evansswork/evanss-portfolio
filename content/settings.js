// @ts-check
// ============================================================
//  SETTINGS — saklar untuk tampilan & fitur. Tidak perlu ngoding.
// ============================================================

/** @type {import('./types').Settings} */
export const settings = {
  // Animasi pembuka. Pilihan:
  //   'zoom'  → nama raksasa sebagai "jendela" ke hero 3D, lalu kamera menyelam ke titiknya (default)
  //   'paper' → lubang-lubang kertas warna (lingkaran, segi enam, pil, bintang) membuka berlapis
  //   'slot'  → kata bergulir, name tag dibanting lalu terbang ke hero
  //   'none'  → tanpa opening
  // Bisa juga dicoba lewat URL: ?opening=paper
  opening: 'edit',

  // Baris "dev" di footer: tombol "Try openings" + "Show todos".
  // Set ke false sebelum link portofolio dibagikan ke recruiter.
  openingPicker: true,

  // Tampilkan penanda yang belum diisi (teks 'TODO:', screenshot yang belum ada, link kosong)
  // dengan garis putus-putus oranye. false = disembunyikan, jadi pengunjung hanya melihat yang sudah jadi.
  showTodos: false,

  // Alamat website setelah deploy (mis. 'https://evansuryadinata.vercel.app') — dipakai di CV otomatis.
  siteUrl: '',

  // Vercel Web Analytics (gratis): true lalu aktifkan "Analytics" di dashboard proyek Vercel.
  vercelAnalytics: false,

  // Teks di opening 'zoom' (kata besar + dua keterangan pojok bawah)
  openingWord: 'Evan',
  openingCaptions: ['marketing × creative × code', 'Surabaya, ID'],

  features: {
    cursor: true,          // cursor custom (hanya desktop)
    sound: true,           // tombol suara di nav (default mati; pengunjung yang menyalakan)
    confetti: true,        // konfeti saat bentuk 3D di-pop
    velocityMarquee: true, // teks berjalan ikut ngebut & berbalik arah mengikuti scroll
    wordmark: true,        // nama raksasa di footer yang membal saat disentuh (klik titiknya = putar ulang opening)
    clock: true,           // jam lokal di footer
    scrollBadge: true,     // badge bulat kanan bawah (klik = kembali ke atas)
    headlineRotator: true, // judul hero berganti: content → code → scripts (isi di profile.js → headlines)
    timeline: true,        // grafik timeline pengalaman di atas daftar Experience
    composer: true,        // pilihan "ada perlu apa?" di Contact → email / WhatsApp yang sudah terisi
    commandPalette: true,  // menu cepat Ctrl/⌘ + K (desktop)
    cvSheet: true,         // CV otomatis yang bisa disimpan jadi PDF (dipakai kalau file CV PDF belum ada)
  },

  // Jam lokal (fitur clock)
  city: 'Surabaya',
  timezone: 'Asia/Jakarta',
  timezoneLabel: 'WIB',
};
