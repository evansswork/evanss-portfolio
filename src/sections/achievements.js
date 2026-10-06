// Section "Achievements": tiap pencapaian tampil sebagai medali yang tergantung di rak.
// Medali jatuh ke rak saat section terlihat, berayun saat disentuh, dan menaut ke buktinya.
// Data: content/achievements.js (todo: true → tersembunyi dari pengunjung).
import gsap from 'gsap';
import { reduced } from '../ui/env.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function proofLink(ref) {
  if (!ref) return '';
  const at = ref.indexOf(':');
  const kind = ref.slice(0, at), key = ref.slice(at + 1);
  if (kind === 'case') return `<a class="link medal__proof" href="#case-${esc(key)}" data-case="${esc(key)}">See the proof</a>`;
  if (kind === 'xp') return `<a class="link medal__proof" href="#experience" data-xp="${esc(key)}">See the proof</a>`;
  if (kind === 'file' || kind === 'url') return `<a class="link medal__proof" href="${esc(key)}" target="_blank" rel="noopener">See the proof</a>`;
  return '';
}

export function renderAchievements(list = []) {
  const el = document.querySelector('#medals');
  if (!el) return;
  if (!list.length) { el.closest('section')?.remove(); return; }
  el.innerHTML = list.map((a) => `
    <li class="medal medal--${esc(a.color || 'yellow')}${a.todo ? ' is-todo' : ''}">
      <div class="medal__hang">
        <span class="medal__ribbon" aria-hidden="true"></span>
        <div class="medal__disc"><span>${esc(a.badge)}</span></div>
      </div>
      <h3>${a.todo ? '<b class="todo-tag">TODO</b>' : ''}${esc(a.title)}</h3>
      <p>${esc(a.issuer)}, ${esc(a.year)}</p>
      ${proofLink(a.proof)}
    </li>`).join('');
}

export function initAchievementsMotion() {
  const el = document.querySelector('#medals');
  if (!el || reduced) return;
  const hangs = el.querySelectorAll('.medal__hang');
  gsap.from(hangs, {
    y: -150, rotation: (i) => [-16, 12, -9, 14][i % 4], duration: 1.15, ease: 'bounce.out', stagger: 0.15,
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
  });
  gsap.from(el.querySelectorAll('.medal h3, .medal p, .medal__proof'), {
    opacity: 0, y: 12, duration: 0.6, stagger: 0.05, delay: 0.5,
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
  });
}
