// Badge bulat kanan bawah: berputar mengikuti scroll, klik = kembali ke atas.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initBadge(lenis) {
  const badge = document.querySelector('#scroll-badge');
  if (!badge) return;
  const svg = badge.querySelector('svg');
  ScrollTrigger.create({
    start: 'top -60%',
    onUpdate: (self) => gsap.set(svg, { rotate: self.scroll() / 6 }),
    onToggle: (self) => badge.classList.toggle('is-visible', self.isActive),
  });
  badge.addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' })));
}
