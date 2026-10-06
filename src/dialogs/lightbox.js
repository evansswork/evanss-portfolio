// Lightbox: klik screenshot bukti di case study → tampil layar penuh.
import gsap from 'gsap';
import { setBackgroundInert } from '../ui/dialog.js';

export function initLightbox() {
  const box = document.querySelector('#lightbox');
  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  let open = false;
  const close = () => {
    if (!open) return;
    open = false;
    setBackgroundInert(false);
    gsap.to(box, { autoAlpha: 0, duration: 0.25, onComplete: () => { box.classList.remove('is-open'); box.setAttribute('aria-hidden', 'true'); } });
  };
  document.addEventListener('click', (e) => {
    const shot = e.target.closest('.case__shot.has-image');
    if (shot) {
      img.src = shot.querySelector('img').src;
      img.alt = shot.querySelector('figcaption')?.textContent || '';
      cap.textContent = img.alt;
      open = true;
      setBackgroundInert(true);
      box.classList.add('is-open'); box.setAttribute('aria-hidden', 'false');
      gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      gsap.fromTo(box.querySelector('.lightbox__fig'), { scale: 0.92, rotate: -1 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.5)' });
      return;
    }
    if (e.target.closest('[data-lightbox-close]')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
