// Grafik timeline pengalaman ("at a glance"): satu batang per role, warna = kelompok.
// Hover = detail, klik = membuka role itu di daftar Experience. Data: content/experience.js → start / end.
import gsap from 'gsap';
import { reduced } from '../ui/env.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const toIdx = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initTimeline(groups) {
  const el = document.querySelector('#xp-timeline');
  if (!el) return;
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  const items = groups
    .flatMap((g) => g.items.map((x, i) => ({ ...x, gid: g.id, color: g.color, key: x.id || `${g.id}-${i}` })))
    .filter((x) => x.start);
  if (!items.length) { el.remove(); return; }
  items.forEach((x) => { x.s = toIdx(x.start); x.e = x.end ? toIdx(x.end) : nowIdx; x.ongoing = !x.end; });
  items.sort((a, b) => a.s - b.s || b.e - a.e);
  const min = Math.min(...items.map((x) => x.s));
  const max = Math.max(nowIdx, ...items.map((x) => x.e));
  const n = max - min + 1;
  const rows = items.length;

  let axis = '';
  for (let m = min; m <= max; m++) {
    const mo = m % 12, col = m - min + 1;
    if (mo === 0) axis += `<span class="tl__tick is-year" style="grid-column:${col}"><b>${Math.floor(m / 12)}</b></span><i class="tl__line" style="grid-column:${col};grid-row:1 / span ${rows + 1}"></i>`;
    else if (mo % 3 === 0) axis += `<span class="tl__tick" style="grid-column:${col}">${MONTHS[mo]}</span>`;
  }
  const bars = items.map((x, r) => {
    const c0 = x.s - min + 1, c1 = x.e - min + 2;
    const name = esc(x.short || x.company.split(' · ')[0]);
    return `<button class="tl__bar tl__bar--${x.color}${x.ongoing ? ' is-ongoing' : ''}" style="grid-row:${r + 2};grid-column:${c0} / ${c1}" data-xp="${x.key}" data-group="${x.gid}" data-role="${esc(x.role)}" data-company="${esc(x.company)}" data-period="${esc(x.period)}" aria-label="${esc(x.role)} at ${esc(x.company)}, ${esc(x.period)}"><span>${name}</span></button>`;
  }).join('');
  const legend = groups.map((g) => `<button class="tl__key tl__key--${g.color}" data-group="${g.id}">${esc(g.title)}</button>`).join('');

  el.innerHTML = `
    <div class="tl__legend">${legend}<span class="tl__hint">Hover a bar for details, click to open it</span></div>
    <div class="tl__scroll"><div class="tl__grid" style="--n:${n};--rows:${rows}">
      ${axis}${bars}
      <i class="tl__now" style="grid-column:${nowIdx - min + 1};grid-row:2 / span ${rows}"><b>now</b></i>
    </div></div>
    <div class="tl__tip" aria-hidden="true"></div>`;

  const tip = el.querySelector('.tl__tip');
  const showTip = (bar, x, y) => {
    tip.innerHTML = `<b>${bar.dataset.role}</b>${bar.dataset.company}<br>${bar.dataset.period}`;
    tip.style.left = `${x}px`; tip.style.top = `${y}px`;
    tip.classList.add('is-on');
  };
  el.addEventListener('pointermove', (e) => {
    const bar = e.target.closest('.tl__bar');
    if (!bar) return tip.classList.remove('is-on');
    const r = el.getBoundingClientRect();
    showTip(bar, e.clientX - r.left, e.clientY - r.top);
  });
  el.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
  el.addEventListener('focusin', (e) => {
    const bar = e.target.closest('.tl__bar');
    if (!bar) return;
    const r = el.getBoundingClientRect(), b = bar.getBoundingClientRect();
    showTip(bar, b.left - r.left + b.width / 2, b.top - r.top);
  });
  el.addEventListener('focusout', () => tip.classList.remove('is-on'));

  // klik batang → ditangani oleh sections/experience-links.js (atribut data-xp)

  // legenda: sorot satu kelompok
  const dimAll = (gid) => el.querySelectorAll('.tl__bar').forEach((b) => b.classList.toggle('is-dim', !!gid && b.dataset.group !== gid));
  el.querySelectorAll('.tl__key').forEach((k) => {
    k.addEventListener('pointerenter', () => dimAll(k.dataset.group));
    k.addEventListener('pointerleave', () => dimAll(null));
    k.addEventListener('focus', () => dimAll(k.dataset.group));
    k.addEventListener('blur', () => dimAll(null));
  });

  if (!reduced) {
    gsap.from(el.querySelectorAll('.tl__bar'), {
      scaleX: 0, transformOrigin: '0% 50%', duration: 0.8, ease: 'power3.out', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      clearProps: 'transform',
    });
    gsap.from(el.querySelectorAll('.tl__now'), { autoAlpha: 0, duration: 0.5, delay: 0.6, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
  }
}
