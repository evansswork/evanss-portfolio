// Experience: setiap role bisa dibuka-tutup.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sfx } from '../ui/sound.js';

export function initAccordion() {
  document.querySelectorAll('.xp__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.xp');
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
      sfx(isOpen ? 'open' : 'tick');
      gsap.delayedCall(0.55, () => ScrollTrigger.refresh());
    });
  });
}
