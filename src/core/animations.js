import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- split text ----------
function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(' ')
    .map((w) => `<span class="word" aria-hidden="true">${[...w].map((ch) => `<span class="char">${ch}</span>`).join('')}</span>`)
    .join(' ');
  return el.querySelectorAll('.char');
}
function splitWords(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(' ').map((w) => `<span class="line-mask"><span class="word" aria-hidden="true">${w}</span></span>`).join(' ');
  return el.querySelectorAll('.word');
}

// ---------- hero intro ----------
// Dibuat SEBELUM opening berjalan (dalam keadaan paused) supaya elemen hero tersembunyi sejak awal,
// lalu diputar oleh opening tepat saat "serah terima" (onHandoff). Bisa dibuat ulang untuk replay.
let current = null;
export function buildIntro({ withNametag = true } = {}) {
  current?.progress(1).kill();
  document.querySelectorAll('[data-hero-line]').forEach((line) => {
    if (!line.querySelector(':scope > .word')) line.innerHTML = `<span class="word">${line.innerHTML}</span>`;
  });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
  current = tl;

  if (reduced) {
    tl.set(['.hero__nametag', '.hero__lede', '.hero__actions', '.hero__focus', '.hero__hint', '.nav', '.sticker'], { autoAlpha: 1 });
    return tl;
  }
  if (withNametag) tl.fromTo('.hero__nametag', { scale: 0, rotate: 12, autoAlpha: 0 }, { scale: 1, rotate: -2, autoAlpha: 1, duration: 0.8, ease: 'back.out(2)' }, 0);
  tl.from('.hero__title .word', { yPercent: 140, rotate: 3, duration: 1.1, stagger: 0.12 }, 0.15)
    .from('.hero__lede', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.6)
    .from('.hero__actions .btn', { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.75)
    .from('.hero__focus', { y: 16, autoAlpha: 0, duration: 0.6 }, 0.95)
    .from('.hero__hint', { autoAlpha: 0, duration: 0.6 }, 1.2)
    .from('.nav', { yPercent: -100, autoAlpha: 0, duration: 0.8 }, 0.6)
    .from('.hero__stickers .sticker', { scale: 0, rotate: '-=25', duration: 0.9, ease: 'back.out(2.2)', stagger: 0.08 }, 0.9);
  return tl;
}

// ---------- scroll-driven ----------
export function initScrollAnimations(scene) {
  document.querySelectorAll('[data-split-words]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  document.querySelectorAll('.contact__title').forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, { yPercent: 100, autoAlpha: 0, rotate: 6, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.018, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
  });

  // reveal: muncul dengan sedikit "pop"
  // Hanya transparan (bukan visibility:hidden) supaya elemen tetap bisa dijangkau keyboard & teknologi bantu;
  // kalau menerima fokus sebelum ter-scroll, langsung ditampilkan.
  gsap.set('[data-reveal]', { opacity: 0, y: 24, scale: 0.98 });
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest?.('[data-reveal]');
    if (el && Number(getComputedStyle(el).opacity) < 1) gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.3, overwrite: true, clearProps: 'scale' });
  });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.06, overwrite: true, clearProps: 'scale' }),
  });

  // counter angka
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    gsap.to(obj, { v: end, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onUpdate: () => (el.textContent = obj.v.toFixed(decimals)) });
  });

  // hero: konten memudar & 3D naik saat scroll
  const hero = document.querySelector('#hero');
  gsap.fromTo('.hero__inner', { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 45%', scrub: true } });
  gsap.to('.hero__stickers', { y: -140, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  if (scene) ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onUpdate: (self) => scene.setScroll(self.progress) });

  // nav
  const nav = document.querySelector('#nav');
  let navHidden = false;
  const setNavHidden = (v) => {
    if (v === navHidden) return;
    navHidden = v;
    gsap.to(nav, { yPercent: v ? -110 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  };
  ScrollTrigger.create({
    start: 60,
    onUpdate: (self) => {
      nav.classList.toggle('is-scrolled', self.scroll() > 60);
      setNavHidden(self.direction === 1 && self.scroll() > 400);
    },
    onLeaveBack: () => { nav.classList.remove('is-scrolled'); setNavHidden(false); },
  });
  document.querySelectorAll('main section[id]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        document.querySelectorAll('.nav__links a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${sec.id}`));
      },
    });
  });
}

export { gsap, ScrollTrigger };
