// Judul hero yang berganti-ganti: "Content that actually sells." → "Code that actually ships." → ...
// Isi, warna & fokus diatur di content/profile.js → headlines. Mengikuti pilihan "Hiring for"
// (hanya judul marketing / tech), dan berhenti saat hero tidak terlihat.
import gsap from 'gsap';
import { reduced } from '../ui/env.js';

export function initHeadlineRotator(headlines = [], { interval = 3.4 } = {}) {
  const lead = document.querySelector('[data-lead]');
  const punch = document.querySelector('[data-punch]');
  const title = document.querySelector('#hero-title');
  if (!lead || !punch || !headlines.length) return { setFocus() {} };
  const words = [lead.closest('.word'), punch.closest('.word')];
  let active = headlines, i = 0, call = null, tl = null, visible = true, started = false;

  const set = (h) => {
    lead.textContent = h.lead; punch.textContent = h.punch; punch.dataset.color = h.color || 'pink';
    title?.setAttribute('aria-label', `${h.lead} ${h.punch}`);
  };
  const schedule = (delay) => { call?.kill(); if (!reduced && active.length > 1) call = gsap.delayedCall(delay, next); };
  function next() {
    if (!visible || document.hidden) return schedule(interval);
    i = (i + 1) % active.length;
    tl = gsap.timeline({ onComplete: () => schedule(interval) })
      .to(words, { yPercent: -140, rotate: -3, duration: 0.42, ease: 'power3.in', stagger: 0.06 })
      .add(() => set(active[i]))
      .fromTo(words, { yPercent: 140, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 0.75, ease: 'back.out(1.7)', stagger: 0.08 });
  }
  const stop = () => { call?.kill(); tl?.kill(); call = tl = null; };

  window.addEventListener('opening:start', () => { stop(); i = 0; set(active[0]); gsap.set(words, { yPercent: 0, rotate: 0 }); });
  window.addEventListener('opening:handoff', () => { started = true; schedule(interval + 1.6); });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(document.querySelector('#hero'));

  return {
    // focus: 'all' | 'marketing' | 'tech'
    setFocus(focus) {
      const list = focus === 'all' ? headlines : headlines.filter((h) => !h.focus || h.focus === focus);
      active = list.length ? list : headlines;
      stop();
      i = 0;
      if (!started || reduced) { set(active[0]); return; }
      tl = gsap.timeline({ onComplete: () => schedule(interval) })
        .to(words, { yPercent: -140, duration: 0.3, ease: 'power3.in', stagger: 0.05 })
        .add(() => set(active[0]))
        .fromTo(words, { yPercent: 140 }, { yPercent: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.07 });
    },
  };
}
