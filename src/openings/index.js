// Daftar opening + pemilihnya. Untuk menambah opening baru:
//   1. buat file baru di folder ini (lihat none.js sebagai contoh paling sederhana)
//   2. daftarkan di objek VARIANTS di bawah
//   3. pakai namanya di content/settings.js → opening
import edit from './edit.js';
import zoom from './zoom.js';
import paper from './paper.js';
import slot, { handlesNametag as slotNametag } from './slot.js';
import none from './none.js';

const VARIANTS = { edit, zoom, paper, slot, none };
const NAMETAG = { slot: slotNametag };

export const OPENINGS = Object.keys(VARIANTS);

// Prioritas: ?opening= di URL → settings.opening → 'edit'. Reduced motion → 'none'.
export function pickOpening(fallback) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';
  const q = new URLSearchParams(window.location.search).get('opening');
  if (q && VARIANTS[q]) return q;
  return VARIANTS[fallback] ? fallback : 'edit';
}

export const openingHandlesNametag = (name) => !!NAMETAG[name];

export function runOpening(name, ctx) {
  return (VARIANTS[name] || none)(ctx);
}
