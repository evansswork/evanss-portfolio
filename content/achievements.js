// @ts-check
// ============================================================
//  ACHIEVEMENTS — penghargaan, kompetisi, seleksi (section "Achievements" + CV)
//  badge : teks pendek di medali (maks ±14 huruf)
//  color : yellow | pink | blue | green | orange
//  proof : 'case:<slug>' | 'xp:<id>' | 'file:/files/...pdf' | 'url:https://...'
//  todo  : true → disembunyikan dari pengunjung (muncul di mode "Show todos"), tidak dicetak di CV.
//          Hapus todo: true setelah penghargaannya resmi kamu dapat.
// ============================================================

/** @type {import('./types').Achievement[]} */
export const achievements = [
  {
    badge: 'Top freshman',
    title: 'Freshman of 2024 with Outstanding Academic Achievement',
    issuer: 'Petra Christian University',
    year: '2024',
    color: 'yellow',
    proof: 'file:/files/education/freshman-award-2024.pdf',
  },
  {
    badge: '4× podium',
    title: '4 podium finishes (1st–3rd) across 11 tournaments',
    issuer: 'Petra Esports, as Head of the MLBB Division',
    year: '2025 — 2026',
    color: 'blue',
    proof: 'xp:petra-esports',
  },
  {
    badge: 'Selected',
    title: 'Selected for the AI Engineer cohort of Coding Camp powered by DBS Foundation',
    issuer: 'DBS Foundation',
    year: '2026',
    color: 'pink',
    proof: 'xp:dbs',
  },
  {
    badge: 'Best capstone',
    title: 'Best Capstone Project — Fair Price Finder',
    issuer: 'Coding Camp powered by DBS Foundation',
    year: '2026',
    color: 'green',
    proof: 'case:fair-price-finder',
    todo: true,
  },
];
