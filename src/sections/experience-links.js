// Elemen apa pun dengan data-xp="<id role>" → buka role itu di Experience, gulir ke sana, dan sorot sebentar.
// Dipakai oleh: kartu angka di About, daftar "Right now", timeline, panel bukti skill.
import { sfx } from '../ui/sound.js';

let lenisRef = null;

export function openExperience(id) {
  const item = document.querySelector(`.xp[data-xp-id="${CSS.escape(id)}"]`);
  if (!item) return;
  if (!item.classList.contains('is-open')) item.querySelector('.xp__toggle')?.click();
  const flash = () => { item.classList.remove('is-flash'); void item.offsetWidth; item.classList.add('is-flash'); };
  if (lenisRef) lenisRef.scrollTo(item, { offset: -110, duration: 1.1, onComplete: flash });
  else { item.scrollIntoView({ behavior: 'smooth', block: 'center' }); flash(); }
}

export function initExperienceLinks(lenis) {
  lenisRef = lenis;
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-xp]');
    if (!link) return;
    e.preventDefault();
    sfx('tick');
    openExperience(link.dataset.xp);
  });
}
