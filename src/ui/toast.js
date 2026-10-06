// Notifikasi kecil di bawah layar: toast('Teks').
import gsap from 'gsap';

let tl;
export function toast(text) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = text;
  tl?.kill();
  tl = gsap.timeline()
    .fromTo(el, { autoAlpha: 0, y: 20, scale: 0.8, rotate: -4 }, { autoAlpha: 1, y: 0, scale: 1, rotate: -2, duration: 0.45, ease: 'back.out(2)' })
    .to(el, { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 1.6);
}
