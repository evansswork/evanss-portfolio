// Deteksi perangkat & preferensi, dipakai bersama oleh semua fitur.
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => window.matchMedia('(max-width: 720px)').matches;
// HP, atau tablet dalam posisi portrait → hero memakai layout bertumpuk
export const isStacked = () => window.innerWidth < 720 || (window.innerWidth < 1100 && window.innerHeight > window.innerWidth * 1.1);
