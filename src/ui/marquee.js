// Teks berjalan (marquee) yang hidup: ngebut saat halaman di-scroll, berbalik arah saat scroll ke atas,
// melambat saat di-hover (supaya bisa dibaca), dan strip hitam miring sedikit mengikuti kecepatan scroll.
import gsap from 'gsap';
import { reduced } from './env.js';

export function initMarquees(lenis, { velocity = true } = {}) {
  const rows = [...document.querySelectorAll('.marquee')].map((el) => {
    const track = el.querySelector('.marquee__track');
    track.style.animation = 'none';
    const reverse = el.classList.contains('marquee--reverse');
    const base = parseFloat(getComputedStyle(el).getPropertyValue('--marquee-speed')) || 40;
    const tween = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: base * (reduced ? 5 : 1), ease: 'none', repeat: -1 });
    tween.totalTime(base * 200); // mulai "jauh di tengah" supaya bisa diputar mundur tanpa mentok
    const state = { tween, hover: 1, skew: el.classList.contains('marquee--strip') ? gsap.quickSetter(track, 'skewX', 'deg') : null };
    new IntersectionObserver(([e]) => tween.paused(!e.isIntersecting)).observe(el); // hemat baterai
    el.addEventListener('pointerenter', () => gsap.to(state, { hover: 0.12, duration: 0.6, ease: 'power2.out' }));
    el.addEventListener('pointerleave', () => gsap.to(state, { hover: 1, duration: 0.6, ease: 'power2.out' }));
    return state;
  });
  if (!rows.length) return;

  let v = 0, dir = 1, smooth = 0;
  if (velocity && !reduced) {
    lenis?.on('scroll', (l) => {
      v = l.velocity || 0;
      if (Math.abs(v) > 0.3) dir = Math.sign(v);
    });
  }
  gsap.ticker.add(() => {
    smooth += (v - smooth) * 0.12;
    v *= 0.9;
    const boost = Math.min(Math.abs(smooth) * 0.22, 6);
    rows.forEach((r) => {
      r.tween.timeScale(dir * (1 + boost) * r.hover);
      r.skew?.(gsap.utils.clamp(-8, 8, -smooth * 0.35));
    });
  });
}
