// @ts-check
// ============================================================
//  EDUCATION
//  logo : public/images/education/ (opsional)
//  note : badge penghargaan. Kalau noteFile diisi, badge bisa diklik → buka PDF.
//  file : (opsional) dokumen sekolah (ijazah/transkrip) → tombol "Open document".
//  Taruh PDF di public/files/education/
//  inCV : false → tidak dicantumkan di CV otomatis (tetap tampil di website)
// ============================================================

/** @type {import('./types').Education[]} */
export const education = [
  {
    school: 'Petra Christian University',
    degree: 'Bachelor of Informatics — AI Engineering',
    period: '2024 — 2028 (expected)',
    note: 'Freshman of 2024 with Outstanding Academic Achievement',
    noteFile: '/files/education/freshman-award-2024.pdf',
    file: '',
    logo: '/images/education/petra-university.webp',
  },
  {
    school: 'SMA Kristen Petra 2, Surabaya',
    degree: 'High School Diploma — Science Major',
    period: '2021 — 2024',
    note: '',
    noteFile: '',
    file: '',
    logo: '/images/education/petra-sma.webp',
  },
  {
    school: 'SMP Kristen Petra 3, Surabaya',
    degree: 'Junior High School',
    inCV: false,
    period: '2018 — 2021',
    note: '',
    noteFile: '',
    file: '',
    logo: '/images/education/petra-smp.webp',
  },
];
