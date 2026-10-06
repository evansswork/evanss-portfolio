// Efek miring 3D mengikuti cursor (dipakai foto About, atribut data-tilt).
import gsap from 'gsap';
import { finePointer, reduced } from './env.js';

export function initTilt() {
  if (!finePointer || reduced) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 800 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      ry(((e.clientX - r.left) / r.width - 0.5) * 12);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
