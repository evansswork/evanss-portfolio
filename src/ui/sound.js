// Suara UI yang disintesis langsung di browser (Web Audio) — tidak ada file audio, 0 KB tambahan.
// Default MATI. Pengunjung menyalakannya lewat tombol speaker di nav.
// Pakai dari fitur lain: import { sfx } from './sound.js'; sfx('pop');
import { toast } from './toast.js';

let ctx = null;
let master = null;
let on = false;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return true;
}

function tone({ type = 'sine', from = 600, to = 200, dur = 0.15, gain = 0.3, delay = 0 }) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.06);
}

const SOUNDS = {
  pop: () => { const p = 0.8 + Math.random() * 0.5; tone({ from: 720 * p, to: 150 * p, dur: 0.13, gain: 0.32 }); },
  tick: () => tone({ type: 'triangle', from: 1400, to: 900, dur: 0.035, gain: 0.08 }),
  thud: () => tone({ type: 'sine', from: 220, to: 70, dur: 0.12, gain: 0.25 }),
  open: () => { tone({ type: 'triangle', from: 440, to: 660, dur: 0.09, gain: 0.12 }); tone({ type: 'triangle', from: 660, to: 990, dur: 0.1, gain: 0.1, delay: 0.07 }); },
  ding: () => { tone({ type: 'sine', from: 880, to: 880, dur: 0.25, gain: 0.18 }); tone({ type: 'sine', from: 1320, to: 1320, dur: 0.3, gain: 0.1, delay: 0.09 }); },
};

export function sfx(name) {
  if (!on || !ctx) return;
  SOUNDS[name]?.();
}

export function initSound() {
  const btn = document.querySelector('#sound-toggle');
  if (!btn) return;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    if (!ensure()) return;
    on = !on;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
    if (on) { SOUNDS.ding(); toast('Sound on. Try popping a shape.'); }
  });
  // bentuk 3D yang di-pop mengirim event 'shapepop'
  document.querySelector('#hero-canvas')?.addEventListener('shapepop', () => sfx('pop'));
}
