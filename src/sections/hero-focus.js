// "Hiring for": pengunjung memilih Marketing atau Tech, dan situs menyesuaikan diri —
// judul & kalimat hero, tab Work default, versi CV, dan section proses konten (disembunyikan untuk Tech).
// Pilihan tersimpan di URL (?for=marketing | ?for=tech), jadi link yang sudah disesuaikan bisa dikirim ke recruiter.
import { sfx } from '../ui/sound.js';

const OPTIONS = [['all', 'Both'], ['marketing', 'Marketing'], ['tech', 'Tech']];
let current = 'all';

/** Versi CV yang cocok dengan fokus saat ini */
export const getFocus = () => (current === 'tech' ? 'tech' : 'marketing');

export function initFocus({ profile, onChange }) {
  const el = document.querySelector('#hero-focus');
  if (!el) return { set() {} };
  const fromUrl = new URLSearchParams(window.location.search).get('for');
  current = OPTIONS.some(([v]) => v === fromUrl) ? fromUrl : 'all';
  el.innerHTML = `<span class="focus__label" id="focus-label">Hiring for</span>
    <div class="focus__group" role="radiogroup" aria-labelledby="focus-label">
      ${OPTIONS.map(([v, label]) => `<button role="radio" aria-checked="${v === current}" data-focus-option="${v}">${label}</button>`).join('')}
    </div>`;

  const apply = (v, initial = false) => {
    current = v;
    document.documentElement.dataset.focus = v;
    el.querySelectorAll('[data-focus-option]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.focusOption === v)));
    const lede = document.querySelector('#hero-lede');
    if (lede) lede.textContent = (v !== 'all' && profile.taglines?.[v]) || profile.tagline;
    const url = new URL(window.location.href);
    if (v === 'all') url.searchParams.delete('for'); else url.searchParams.set('for', v);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    onChange?.(v, initial);
  };
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-focus-option]');
    if (!b || b.dataset.focusOption === current) return;
    sfx('tick');
    apply(b.dataset.focusOption);
  });
  apply(current, true);
  return { set: (v) => apply(v) };
}
