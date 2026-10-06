// Saat dialog terbuka (case study, CV, menu cepat, lightbox), seluruh halaman di belakangnya dibuat `inert`:
// tidak bisa dijangkau dengan Tab dan diabaikan screen reader, jadi fokus keyboard "terkunci" di dialog.
// Bisa bertumpuk (mis. lightbox di atas case study) — halaman baru aktif lagi saat dialog terakhir ditutup.
let depth = 0;
const BACKGROUND = ['#main', '#nav', '.footer', '#scroll-badge', '#nav-menu', '.skip-link'];

export function setBackgroundInert(on) {
  depth = Math.max(0, depth + (on ? 1 : -1));
  const inert = depth > 0;
  BACKGROUND.forEach((sel) => document.querySelectorAll(sel).forEach((el) => { el.inert = inert; }));
}
