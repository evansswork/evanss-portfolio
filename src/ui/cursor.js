// Cursor custom: titik yang membesar di atas link, dan bisa menampilkan label
// (pakai atribut data-cursor="Teks" di elemen mana pun).
import gsap from 'gsap';
import { finePointer, reduced } from './env.js';

export function initCursor() {
  if (!finePointer || reduced) return;
  const cursor = document.querySelector('#cursor');
  const label = document.querySelector('#cursor-label');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cursor.style.opacity = 1; }, { passive: true });
  document.addEventListener('mouseleave', () => (cursor.style.opacity = 0));

  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    if (labelled) { label.textContent = labelled.dataset.cursor; cursor.classList.add('is-label'); return; }
    if (e.target.closest('a, button, [data-magnetic], .sticker')) cursor.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('[data-cursor]')) cursor.classList.remove('is-label');
    if (e.target.closest('a, button, [data-magnetic], .sticker')) cursor.classList.remove('is-hover');
  });
  // hover bentuk 3D di hero → label "Pop!"
  document.querySelector('#hero-canvas')?.addEventListener('shapehover', (e) => {
    label.textContent = 'Pop!';
    cursor.classList.toggle('is-label', e.detail);
  });
}
