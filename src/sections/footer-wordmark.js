// Nama raksasa di footer: setiap huruf membal (squash & stretch) saat disentuh cursor/jari,
// dan muncul berurutan saat footer masuk layar. Titiknya = tombol putar ulang opening.
import gsap from 'gsap';
import { reduced } from '../ui/env.js';
import { sfx } from '../ui/sound.js';

export function initWordmark({ onReplay } = {}) {
  const mark = document.querySelector('#wordmark');
  if (!mark) return;
  const letters = mark.querySelectorAll('.wordmark__l');
  const dot = mark.querySelector('.wordmark__dot');

  if (!reduced) {
    gsap.from([...letters, dot], {
      yPercent: 110, rotate: () => gsap.utils.random(-12, 12), duration: 1, ease: 'back.out(1.4)', stagger: 0.07,
      scrollTrigger: { trigger: mark, start: 'top 92%', once: true },
    });
    const jiggle = (el) => {
      if (gsap.isTweening(el)) return;
      sfx('tick');
      gsap.timeline()
        .to(el, { scaleY: 0.72, scaleX: 1.18, duration: 0.12, ease: 'power2.out', transformOrigin: '50% 100%' })
        .to(el, { scaleY: 1, scaleX: 1, duration: 0.9, ease: 'elastic.out(1, 0.28)' });
    };
    letters.forEach((l) => l.addEventListener('pointerenter', () => jiggle(l)));
  }
  dot?.addEventListener('click', () => onReplay?.());
  dot?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onReplay?.(); } });
}
