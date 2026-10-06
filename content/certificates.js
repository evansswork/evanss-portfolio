// @ts-check
// ============================================================
//  CERTIFICATES — tiap item bisa diklik kalau 'file' atau 'link' diisi.
//  file : PDF di public/files/certificates/  (dipakai lebih dulu)
//  link : URL verifikasi online (mis. dicoding.com/certificates/XXXX)
// ============================================================

/** @type {import('./types').Certificate[]} */
export const certificates = [
  { title: 'Membangun Proyek Deep Learning Tingkat Mahir', issuer: 'Dicoding', year: '2026', file: '/files/certificates/dicoding-deep-learning-mahir.pdf', link: '' },
  { title: 'Belajar Fundamental Deep Learning', issuer: 'Dicoding', year: '2026', file: '/files/certificates/dicoding-fundamental-deep-learning.pdf', link: '' },
  { title: 'Memulai Pemrograman dengan Python', issuer: 'Dicoding', year: '2026', file: '/files/certificates/dicoding-python.pdf', link: '' },
  { title: 'Belajar Dasar Git dengan GitHub', issuer: 'Dicoding', year: '2026', file: '/files/certificates/dicoding-git-github.pdf', link: '' },
  { title: 'Pengenalan ke Logika Pemrograman', issuer: 'Dicoding', year: '2026', file: '/files/certificates/dicoding-logika-pemrograman.pdf', link: '' },
];
