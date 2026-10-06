// Dinding skill: klik stiker → panel "Where I used X" berisi case study & role yang membuktikannya.
// Sengaja TIDAK bisa di-drag: di trackpad, tekanan kecil sering bergeser beberapa piksel dan
// terbaca sebagai lemparan, sehingga stiker menumpuk dan panel tidak terbuka. Data: content/skills.js
import gsap from 'gsap';
import { sfx } from '../ui/sound.js';
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initEvidence({ skills, projects, groups, lenis }) {
  const wall = document.querySelector('#stickerwall');
  const panel = document.querySelector('#evidence');
  if (!wall || !panel) return;
  const proj = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const roles = Object.fromEntries(groups.flatMap((g) => g.items).filter((x) => x.id).map((x) => [x.id, x]));
  const resolve = (ref) => {
    const at = ref.indexOf(':');
    const kind = ref.slice(0, at), key = ref.slice(at + 1);
    if (kind === 'case' && proj[key]) return { title: proj[key].title, sub: `Case study · ${proj[key].category}`, attrs: `href="#case-${esc(key)}" data-case="${esc(key)}"` };
    if (kind === 'xp' && roles[key]) return { title: roles[key].company, sub: `${roles[key].role}, ${roles[key].period}`, attrs: `href="#experience" data-xp="${esc(key)}"` };
    if (kind === 'go') return { title: 'Experience timeline', sub: 'Several roles running side by side', attrs: `href="${esc(key)}" data-evidence-go="${esc(key)}"` };
    return null;
  };

  let current = -1;
  const buttons = () => wall.querySelectorAll('.skill');
  const close = () => {
    if (current < 0) return;
    current = -1;
    buttons().forEach((b) => b.setAttribute('aria-pressed', 'false'));
    gsap.to(panel, { height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); } });
  };
  const show = (i) => {
    const sk = skills.stickers[i];
    const items = (sk?.proof || []).map(resolve).filter(Boolean);
    if (!items.length) return;
    const wasOpen = current >= 0;
    current = i;
    buttons().forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.skill) === i)));
    panel.innerHTML = `
      <div class="evidence__head">
        <p>Where I used <b>${esc(sk.label)}</b></p>
        <button class="evidence__close" data-evidence-close aria-label="Close"><span></span><span></span></button>
      </div>
      <ul class="evidence__list">${items.map((it) => `<li><a class="evidence__item" ${it.attrs}><b>${esc(it.title)}</b><span>${esc(it.sub)}</span></a></li>`).join('')}</ul>`;
    panel.dataset.tone = wall.querySelector(`.skill[data-skill="${i}"] .sticker`)?.className.match(/sticker--(\w+)/)?.[1] || 'yellow';
    panel.hidden = false;
    sfx('open');
    // pastikan panel terlihat: gulir secukupnya kalau bagian bawahnya di luar layar
    requestAnimationFrame(() => {
      const top = panel.getBoundingClientRect().top;
      const overflow = top + panel.scrollHeight - (window.innerHeight - 24);
      if (overflow > 0) {
        const y = window.scrollY + Math.min(overflow, top - 90);
        lenis ? lenis.scrollTo(y, { duration: 0.8 }) : window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
    if (!wasOpen) gsap.fromTo(panel, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power3.out', clearProps: 'height' });
    gsap.from(panel.querySelectorAll('.evidence__item'), { y: 14, autoAlpha: 0, scale: 0.96, duration: 0.45, stagger: 0.06, ease: 'back.out(1.6)' });
  };

  wall.addEventListener('click', (e) => {
    const b = e.target.closest('.skill');
    if (!b) return;
    const i = Number(b.dataset.skill);
    i === current ? close() : show(i);
  });
  panel.addEventListener('click', (e) => {
    if (e.target.closest('[data-evidence-close]')) return close();
    const go = e.target.closest('[data-evidence-go]');
    if (go) {
      e.preventDefault();
      const t = document.querySelector(go.dataset.evidenceGo);
      if (t) (lenis ? lenis.scrollTo(t, { offset: -110, duration: 1.1 }) : t.scrollIntoView({ behavior: 'smooth' }));
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current >= 0 && !document.querySelector('#modal.is-open, #cmdk.is-open')) close(); });
}
