// Menu cepat ala aplikasi developer: tekan Ctrl+K (Windows) / ⌘K (Mac), atau "/".
// Lompat ke section, buka case study, buka link, salin email, nyalakan suara, putar ulang opening.
import gsap from 'gsap';
import { toast } from '../ui/toast.js';
import { sfx } from '../ui/sound.js';
import { finePointer } from '../ui/env.js';
import { setBackgroundInert } from '../ui/dialog.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initCommandPalette({ lenis, profile, projects, openCase, openCV, replay, setFocus }) {
  const root = document.querySelector('#cmdk');
  if (!root) return;
  const panel = root.querySelector('.cmdk__panel');
  const input = root.querySelector('#cmdk-input');
  const list = root.querySelector('#cmdk-list');
  const btn = document.querySelector('#cmdk-open');
  const isMac = /Mac|iPhone|iPad/i.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);
  if (btn && finePointer) { btn.hidden = false; btn.innerHTML = `<kbd>${isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd>`; }

  const C = profile.contacts || {};
  const goto = (sel) => () => { const t = document.querySelector(sel); if (t) (lenis ? lenis.scrollTo(t, { offset: -70, duration: 1.2 }) : t.scrollIntoView({ behavior: 'smooth' })); };
  const ext = (href) => (href ? () => window.open(href, '_blank', 'noopener') : null);
  const actions = [
    ...[['About', '#about'], ['Experience', '#experience'], ['How I work', '#process'], ['Work', '#work'], ['Achievements', '#achievements'], ['Skills', '#skills'], ['Education', '#education'], ['Contact', '#contact']]
      .filter(([, sel]) => document.querySelector(sel))
      .map(([label, sel]) => ({ group: 'Go to', label, run: goto(sel) })),
    ...projects.filter((p) => p.caseStudy).map((p) => ({ group: 'Case studies', label: p.title, hint: p.category, run: () => openCase(p.slug) })),
    { group: 'Links', label: 'LinkedIn', hint: '/in/evansuryadinata', run: ext(C.linkedin) },
    { group: 'Links', label: 'GitHub', hint: C.github?.replace('https://', ''), run: ext(C.github) },
    { group: 'Links', label: 'Instagram', run: ext(C.instagram) },
    { group: 'Links', label: 'WhatsApp', run: ext(C.whatsapp) },
    { group: 'Links', label: 'View CV', hint: 'printable, always up to date', run: openCV },
    { group: 'Links', label: 'Download CV', hint: 'PDF', run: ext(profile.cv), file: profile.cv },
    ...(setFocus ? [['Marketing', 'marketing'], ['Tech', 'tech'], ['Both (everything)', 'all']].map(([label, v]) => ({ group: 'Hiring for', label, run: () => setFocus(v) })) : []),
    { group: 'Actions', label: 'Copy email address', hint: C.email, run: async () => { try { await navigator.clipboard.writeText(C.email); toast('Email copied.'); } catch { toast(C.email); } } },
    { group: 'Actions', label: 'Write an email', run: () => { window.location.href = `mailto:${C.email}`; } },
    { group: 'Actions', label: 'Toggle sound', run: () => document.querySelector('#sound-toggle')?.click() },
    { group: 'Actions', label: 'Replay the opening', run: replay },
    { group: 'Actions', label: 'Back to top', run: goto('#hero') },
  ].filter((a) => typeof a.run === 'function');

  let open = false, active = 0, shown = [], hadStopped = false;

  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = actions.filter((a) => !(a.file && window.__missingFiles?.has(a.file)) && (!q || `${a.label} ${a.hint || ''} ${a.group}`.toLowerCase().includes(q)));
    active = Math.min(active, Math.max(0, shown.length - 1));
    if (!shown.length) { list.innerHTML = `<li class="cmdk__empty">Nothing matches "${esc(input.value)}".</li>`; return; }
    let html = '', last = '';
    shown.forEach((a, i) => {
      if (a.group !== last) { html += `<li class="cmdk__group" role="presentation">${esc(a.group)}</li>`; last = a.group; }
      html += `<li class="cmdk__item${i === active ? ' is-active' : ''}" role="option" aria-selected="${i === active}" data-i="${i}" id="cmdk-opt-${i}"><span>${esc(a.label)}</span>${a.hint ? `<small>${esc(a.hint)}</small>` : ''}</li>`;
    });
    list.innerHTML = html;
    input.setAttribute('aria-activedescendant', `cmdk-opt-${active}`);
    list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  };

  const show = () => {
    if (open) return;
    open = true;
    hadStopped = !!lenis?.isStopped;
    lenis?.stop();
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    setBackgroundInert(true);
    input.value = ''; active = 0; render();
    gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 });
    gsap.fromTo(panel, { y: -16, scale: 0.97, rotate: -0.6 }, { y: 0, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(1.8)' });
    sfx('open');
    requestAnimationFrame(() => input.focus());
  };
  const hide = () => {
    if (!open) return;
    open = false;
    setBackgroundInert(false);
    gsap.to(root, { autoAlpha: 0, duration: 0.15, onComplete: () => { root.classList.remove('is-open'); root.setAttribute('aria-hidden', 'true'); } });
    if (!hadStopped) lenis?.start();
  };
  const runAt = (i) => {
    const a = shown[i];
    if (!a) return;
    hide();
    setTimeout(() => a.run(), 160);
  };

  btn?.addEventListener('click', show);
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-cmdk-close]')) return hide();
    const item = e.target.closest('.cmdk__item');
    if (item) runAt(Number(item.dataset.i));
  });
  list.addEventListener('pointermove', (e) => {
    const item = e.target.closest('.cmdk__item');
    if (item && Number(item.dataset.i) !== active) { active = Number(item.dataset.i); render(); }
  });
  input.addEventListener('input', () => { active = 0; render(); });
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); open ? hide() : show(); return; }
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable;
    if (!open && k === '/' && !typing) { e.preventDefault(); show(); return; }
    if (!open) return;
    if (k === 'escape') { e.preventDefault(); hide(); }
    else if (k === 'arrowdown') { e.preventDefault(); active = (active + 1) % Math.max(1, shown.length); render(); }
    else if (k === 'arrowup') { e.preventDefault(); active = (active - 1 + shown.length) % Math.max(1, shown.length); render(); }
    else if (k === 'enter') { e.preventDefault(); runAt(active); }
  });
}
