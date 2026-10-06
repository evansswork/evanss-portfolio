// Work: tab "Marketing & content" / "IT & code".
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sfx } from '../ui/sound.js';

export function initTabs() {
  const buttons = document.querySelectorAll('.tabs__btn');
  const panels = document.querySelectorAll('.work__panel');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      sfx('tick');
      buttons.forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      panels.forEach((p) => {
        const show = p.dataset.panel === btn.dataset.tab;
        if (show) {
          p.hidden = false;
          gsap.fromTo(p.children, { autoAlpha: 0, y: 24, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'scale', onComplete: () => ScrollTrigger.refresh() });
        } else p.hidden = true;
      });
    });
  });
}
