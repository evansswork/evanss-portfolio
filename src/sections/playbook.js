// Section "How I make content that works": empat langkah (Research → Hook → Edit → Measure).
// Desktop: section di-pin saat di-scroll; langkah aktif berganti dan layar HP menampilkan visualnya.
// HP/tablet: langkah bertumpuk, masing-masing dengan layar kecilnya sendiri.
// Data: content/playbook.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced } from '../ui/env.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function view(step) {
  switch (step.visual) {
    case 'research':
      return `<div class="pbv pbv--research"><p class="pbv__label">Trend radar</p>
        <div class="pbv__bars">${[28, 40, 34, 52, 70, 96, 86, 58].map((h, i) => `<i class="${i >= 4 && i <= 6 ? 'is-hot' : ''}" style="--h:${h}%"></i>`).join('')}</div>
        <p class="pbv__note"><span></span>Prime time</p>
        <div class="pbv__chips"><span>Trending sound</span><span>Competitor hooks</span><span>Audience questions</span></div></div>`;
    case 'hook':
      return `<div class="pbv pbv--hook"><p class="pbv__label">Script</p>
        <div class="pbv__block is-hook"><small>Hook, first 3 seconds</small><b class="pbv__type" data-text="${esc(step.hookText || 'Wait for the last one…')}">${esc(step.hookText || 'Wait for the last one…')}</b></div>
        <div class="pbv__block"><small>Build-up</small><i style="width:92%"></i><i style="width:70%"></i></div>
        <div class="pbv__block"><small>Payoff + call to action</small><i style="width:80%"></i></div></div>`;
    case 'edit':
      return `<div class="pbv pbv--edit"><p class="pbv__label">Timeline</p>
        <div class="pbv__preview"><span>9:16</span></div>
        <div class="pbv__tracks">
          <div class="pbv__track"><small>Video</small><div>${[[0, 22], [24, 17], [43, 31], [76, 24]].map(([x, w]) => `<i style="left:${x}%;width:${w}%"></i>`).join('')}</div></div>
          <div class="pbv__track pbv__track--text"><small>Text</small><div>${[[4, 14], [26, 20], [52, 16], [78, 18]].map(([x, w]) => `<i style="left:${x}%;width:${w}%"></i>`).join('')}</div></div>
          <div class="pbv__track pbv__track--sound"><small>Sound</small><div><i style="left:0;width:100%"></i></div></div>
          <span class="pbv__scrub"><b class="pbv__playhead"></b></span>
        </div></div>`;
    case 'measure':
      return `<div class="pbv pbv--measure"><p class="pbv__label">Insights</p>
        <p class="pbv__big"><span data-to="1.4">1.4</span>M+<small>views on the top reel</small></p>
        <svg class="pbv__spark" viewBox="0 0 200 64" aria-hidden="true"><path d="M0 58 C 26 56, 46 52, 66 46 S 104 36, 126 24 S 168 10, 200 4" /></svg>
        <div class="pbv__chips"><span>97.3% non-followers</span><span>51K likes</span><span>564K reached</span></div></div>`;
    default:
      return '';
  }
}

function proofLink(step) {
  if (!step.proof) return '';
  const [kind, key] = [step.proof.slice(0, step.proof.indexOf(':')), step.proof.slice(step.proof.indexOf(':') + 1)];
  if (kind !== 'case') return '';
  return `<a class="link pb__proof" href="#case-${esc(key)}" data-case="${esc(key)}">${esc(step.proofLabel || 'See the case study')}</a>`;
}

export function renderPlaybook(data) {
  const el = document.querySelector('#playbook');
  if (!el) return;
  const steps = data?.steps || [];
  if (!steps.length) { el.closest('section')?.remove(); return; }
  el.innerHTML = `
    <div class="pb__list">
    <i class="pb__rail" aria-hidden="true"><b></b></i>
    <ol class="pb__steps">
      ${steps.map((s, i) => `
        <li class="pb__step${i === 0 ? ' is-active' : ''}" data-step="${i}">
          <span class="pb__num">${String(i + 1).padStart(2, '0')}</span>
          <div class="pb__body">
            <h3>${esc(s.title)} <span>${esc(s.lead)}</span></h3>
            <p>${esc(s.text)}</p>
            <div class="pb__tools">${(s.tools || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
            ${proofLink(s)}
            <div class="pb__mini" aria-hidden="true">${view(s)}</div>
          </div>
        </li>`).join('')}
    </ol>
    </div>
    <div class="pb__device" aria-hidden="true">
      <div class="pb__phone"><div class="pb__screen">${steps.map((s, i) => `<div class="pb__view${i === 0 ? ' is-active' : ''}" data-view="${i}">${view(s)}</div>`).join('')}</div></div>
    </div>`;
}

// animasi isi satu layar; mengembalikan timeline supaya bisa dihentikan
function play(root) {
  const v = root.querySelector('.pbv');
  if (!v || reduced) return null;
  const tl = gsap.timeline();
  if (v.classList.contains('pbv--research')) {
    tl.fromTo(v.querySelectorAll('.pbv__bars i'), { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.6, ease: 'back.out(1.6)', stagger: 0.05 })
      .fromTo(v.querySelectorAll('.pbv__chips span'), { scale: 0, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.08 }, '-=0.2');
  } else if (v.classList.contains('pbv--hook')) {
    const t = v.querySelector('.pbv__type');
    const full = t.dataset.text || '';
    const o = { n: 0 };
    t.textContent = '';
    tl.fromTo(v.querySelectorAll('.pbv__block'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: 'power3.out' })
      .to(o, { n: full.length, duration: Math.min(1.8, full.length * 0.045), ease: 'none', onUpdate: () => { t.textContent = full.slice(0, Math.round(o.n)); } }, 0.2);
  } else if (v.classList.contains('pbv--edit')) {
    tl.fromTo(v.querySelectorAll('.pbv__track i'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.45, ease: 'power3.out', stagger: 0.04 })
      .fromTo(v.querySelector('.pbv__playhead'), { left: '0%' }, { left: '100%', duration: 2.6, ease: 'none', repeat: -1 }, 0.3);
  } else if (v.classList.contains('pbv--measure')) {
    const num = v.querySelector('[data-to]');
    const path = v.querySelector('.pbv__spark path');
    const len = path.getTotalLength();
    const o = { v: 0 };
    tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' })
      .to(o, { v: Number(num.dataset.to), duration: 1.2, ease: 'power3.out', onUpdate: () => { num.textContent = o.v.toFixed(1); } }, 0)
      .fromTo(v.querySelectorAll('.pbv__chips span'), { scale: 0, rotate: 8 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.08 }, 0.5);
  }
  return tl;
}

export function initPlaybookMotion(lenis) {
  const el = document.querySelector('#playbook');
  if (!el) return;
  const steps = [...el.querySelectorAll('.pb__step')];
  const views = [...el.querySelectorAll('.pb__view')];
  const railFill = el.querySelector('.pb__rail b');
  const n = steps.length;
  const mm = gsap.matchMedia();

  mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
    let active = -1, running = null;
    const setActive = (i) => {
      if (i === active) return;
      active = i;
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      views.forEach((v, k) => v.classList.toggle('is-active', k === i));
      running?.kill();
      running = play(views[i]);
    };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top+=96',
      end: () => `+=${Math.round(window.innerHeight * 0.7 * n)}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        setActive(Math.min(n - 1, Math.floor(self.progress * n)));
        if (railFill) railFill.style.transform = `scaleY(${self.progress})`;
      },
    });
    setActive(0);
    // klik langkah → gulir ke bagian itu
    const onClick = (e) => {
      const s = e.target.closest('.pb__step');
      if (!s || e.target.closest('a')) return;
      const i = Number(s.dataset.step);
      const y = st.start + ((st.end - st.start) * (i + 0.5)) / n;
      lenis ? lenis.scrollTo(y, { duration: 1 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    };
    el.addEventListener('click', onClick);
    return () => { el.removeEventListener('click', onClick); running?.kill(); };
  });

  mm.add('(max-width: 959px), (prefers-reduced-motion: reduce)', () => {
    const triggers = steps.map((s) => ScrollTrigger.create({
      trigger: s, start: 'top 75%', once: true,
      onEnter: () => { s.classList.add('is-active'); play(s.querySelector('.pb__mini')); },
    }));
    return () => triggers.forEach((t) => t.kill());
  });
}
