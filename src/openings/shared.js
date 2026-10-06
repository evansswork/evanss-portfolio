// Alat bantu yang dipakai semua opening.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const SVG_NS = 'http://www.w3.org/2000/svg';
export const COLORS = { yellow: '#ffd23f', pink: '#ff5c8a', blue: '#3d6bff', green: '#35d07f', orange: '#ff8a3d', ink: '#16140f', paper: '#fffcf5' };


export function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  parent?.appendChild(el);
  return el;
}

// Penutup statis di index.html (mencegah hero "berkedip" sebelum JS siap)
export function removeCover() {
  document.querySelector('#opening-cover')?.remove();
}

// Tunggu font judul siap (maksimal ms), supaya ukuran huruf di opening akurat
export function fontsReady(ms = 1500) {
  const load = document.fonts?.load?.('800 200px "Bricolage Grotesque"') ?? Promise.resolve();
  return Promise.race([load.catch(() => {}), wait(ms)]);
}

// Wadah layar penuh untuk sebuah opening. Klik di mana saja = percepat (skip).
export function makeRoot(variant) {
  const root = document.createElement('div');
  root.className = `opening opening--${variant}`;
  root.setAttribute('aria-hidden', 'true');
  root.dataset.cursor = 'Skip';
  document.body.appendChild(root);
  return root;
}
export function skippable(root, tl) {
  root.addEventListener('click', () => tl.timeScale(4), { once: true });
}
