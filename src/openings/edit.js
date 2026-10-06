// OPENING "EDIT" (default) — situs dibuka seperti timeline video editing, keahlian Evan sendiri.
// 1. Jendela preview menyala. Lewat jendela itu terlihat hero 3D yang asli dan sedang bergerak
//    (jendela transparan + box-shadow raksasa berwarna tinta menutup sisa layar).
// 2. Klip HOOK → BUILD-UP → PAYOFF meluncur dan menempel ke track; playhead menyapu, teks muncul
//    sebagai subtitle di preview, timecode berjalan.
// 3. "Exporting" terisi mengikuti loading sungguhan (font, halaman, scene 3D).
// 4. Final cut: jendela preview membesar jadi layar penuh — hasilnya adalah hero.
// Hero muncul ±2 detik setelah mulai (rekomendasi riset: < 2 detik & bisa dilewati) — klik, tombol, atau scroll mempercepat 5×.
// Sekali per sesi: kunjungan berikutnya di tab yang sama memutar versi kilat "Welcome back." (±0,8 detik).
import gsap from 'gsap';
import { removeCover, fontsReady, makeRoot } from './shared.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const noise = (i) => Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1;

// subtitle per klip, diambil dari data (headline marketing & tech di content/profile.js)
function beats(profile) {
  const first = profile.firstName || String(profile.name).split(' ')[0];
  const pick = (focus) => (profile.headlines || []).find((h) => h.focus === focus);
  const line = (h, tone) => (h ? `${esc(h.lead)} <em class="is-${tone}">${esc(h.punch)}</em>` : '');
  const mk = line(pick('marketing'), 'pink') || 'I make content.';
  const tech = line(pick('tech'), 'blue') || 'I write code.';
  // datang lewat link ?for=tech → sisi teknis disebut lebih dulu
  const techFirst = new URLSearchParams(window.location.search).get('for') === 'tech';
  return [
    { at: 0, html: `Hi, I'm ${esc(first)}.` },
    { at: 0.26, html: techFirst ? tech : mk },
    { at: 0.48, html: techFirst ? mk : tech },
    { at: 0.7, html: "Here's the proof." },
  ];
}

export default async function editOpening({ scene, popShapes, onHandoff, profile, express = false }) {
  const root = makeRoot('edit');
  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = W < 720;
  const winW = mobile ? W * 0.88 : Math.min(W * 0.62, 980);
  const winH = mobile ? H * 0.44 : Math.min((winW * 9) / 16, H * 0.52);
  const winX = (W - winW) / 2;
  const winY = mobile ? H * 0.1 : Math.max(48, H * 0.08);
  const lines = beats(profile);

  root.innerHTML = `
    <div class="oe-window"><span class="oe-timecode">00:00:00:00</span><p class="oe-caption"></p></div>
    <div class="oe-panel">
      <div class="oe-head"><span>${esc((profile.firstName || 'portfolio').toLowerCase())}_portfolio_final.mp4</span>
        <span class="oe-export">Exporting <i class="oe-bar"><b></b></i><em class="oe-pct">0%</em></span></div>
      <div class="oe-tracks">
        <div class="oe-row oe-ruler"><small></small><div><span>00:00</span><span>00:01</span><span>00:02</span></div></div>
        <div class="oe-row"><small>V1</small><div class="oe-lane">
          <span class="oe-clip oe-clip--hook">Hook</span><span class="oe-clip oe-clip--build">Build-up</span><span class="oe-clip oe-clip--payoff">Payoff</span>
        </div></div>
        <div class="oe-row"><small>T1</small><div class="oe-lane oe-lane--text">${lines.map((b, i) => `<span class="oe-cap" style="left:${b.at * 100 + 1}%;width:${((lines[i + 1]?.at ?? 1) - b.at) * 100 - 2}%"></span>`).join('')}</div></div>
        <div class="oe-row"><small>A1</small><div class="oe-lane oe-wave">${Array.from({ length: mobile ? 36 : 64 }, (_, i) => `<i style="--h:${(28 + noise(i) * 72).toFixed(0)}%"></i>`).join('')}</div></div>
        <span class="oe-scrub"><b class="oe-playhead"></b></span>
      </div>
    </div>`;
  const win = root.querySelector('.oe-window');
  const panel = root.querySelector('.oe-panel');
  const caption = root.querySelector('.oe-caption');
  const timecode = root.querySelector('.oe-timecode');
  const clips = [...root.querySelectorAll('.oe-clip')];
  const pct = root.querySelector('.oe-pct');
  const bar = root.querySelector('.oe-bar b');
  gsap.set(win, { left: winX, top: winY, width: winW, height: winH });
  gsap.set(panel, { left: winX, top: winY + winH + (mobile ? 18 : 26), width: winW });
  removeCover();

  // loading sungguhan: font judul, seluruh halaman (load), scene 3D — maks. 2,5 detik
  const sources = [
    fontsReady(2500),
    new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true }))),
    Promise.resolve(scene),
  ];
  const real = { v: 0 };
  sources.forEach((p) => p.then(() => { real.v += 1 / sources.length; }));
  const loaded = Promise.race([Promise.all(sources), wait(2500)]);
  // timeline langsung jalan: subtitle pertama baru muncul di 0,5 dtk, dan final cut menunggu font lewat `loaded`

  scene?.prepare({ focus: 1 }); // bentuk 3D berkumpul di tengah, pas di jendela preview
  let speed = 1;
  const timelines = [];
  const skip = () => { speed = 5; timelines.forEach((t) => t.timeScale(5)); };
  const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  events.forEach((ev) => window.addEventListener(ev, skip, { once: true, passive: true }));
  const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, skip));
  const run = (tl) => new Promise((resolve) => { timelines.push(tl); tl.timeScale(speed).eventCallback('onComplete', resolve).play(); });

  // ---------- versi kilat (sudah menonton di sesi ini)
  if (express) {
    caption.innerHTML = 'Welcome back.';
    root.querySelector('.oe-panel').remove();
    await run(gsap.timeline({ paused: true })
      .fromTo(win, { top: winY + winH / 2 - 2, height: 4 }, { top: winY, height: winH, duration: 0.3, ease: 'power3.out' })
      .add(() => popShapes(), 0.05)
      .fromTo(caption, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25 }, 0.12));
    await finalCut();
    return;
  }

  // ---------- 1–2: preview menyala, klip menempel, playhead menyapu
  let current = -1;
  const setBeat = (i) => {
    if (i === current) return;
    current = i;
    caption.innerHTML = lines[i].html;
    gsap.fromTo(caption, { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'back.out(2)' });
    const clipIndex = lines[i].at < 0.26 ? 0 : lines[i].at < 0.7 ? 1 : 2;
    clips.forEach((c, k) => c.classList.toggle('is-on', k === clipIndex));
  };
  const head = { p: 0 };
  await run(gsap.timeline({ paused: true })
    .fromTo(win, { top: winY + winH / 2 - 2, height: 4 }, { top: winY, height: winH, duration: 0.35, ease: 'power3.out' })
    .add(() => popShapes(), 0.08)
    .fromTo(panel, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' }, 0.1)
    .from(clips, { x: (i) => [-140, 60, 160][i], y: -22, rotation: (i) => [-6, 4, 8][i], autoAlpha: 0, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.06 }, 0.18)
    .from(root.querySelectorAll('.oe-cap'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.25, stagger: 0.04 }, 0.28)
    .from(root.querySelectorAll('.oe-wave i'), { scaleY: 0, duration: 0.25, stagger: { amount: 0.25 } }, 0.25)
    .to(head, {
      p: 1, duration: 1.0, ease: 'none',
      onStart: () => setBeat(0),
      onUpdate: () => {
        const p = head.p;
        root.querySelector('.oe-playhead').style.left = `${p * 100}%`;
        const frames = Math.round(p * 2.5 * 25);
        timecode.textContent = `00:00:${String(Math.floor(frames / 25)).padStart(2, '0')}:${String(frames % 25).padStart(2, '0')}`;
        const i = lines.findLastIndex((b) => p >= b.at);
        if (i >= 0) setBeat(i);
        const shown = Math.min(p * 0.92, real.v * 0.99 + 0.01);
        bar.style.transform = `scaleX(${shown})`;
        pct.textContent = `${Math.round(shown * 100)}%`;
      },
    }, 0.5));

  // ---------- 3: selesaikan export begitu semua benar-benar siap
  await loaded;
  const fill = { v: parseFloat(pct.textContent) / 100 || 0 };
  await run(gsap.timeline({ paused: true }).to(fill, {
    v: 1, duration: 0.18, ease: 'power2.out',
    onUpdate: () => { bar.style.transform = `scaleX(${fill.v})`; pct.textContent = `${Math.round(fill.v * 100)}%`; },
  }));
  await finalCut();

  // ---------- 4: final cut — jendela preview menjadi layar penuh
  async function finalCut() {
    const tl = gsap.timeline({ paused: true })
      .to(caption, { autoAlpha: 0, y: -10, duration: 0.2 }, 0)
      .to(timecode, { autoAlpha: 0, duration: 0.15 }, 0);
    const panelEl = root.querySelector('.oe-panel');
    if (panelEl) tl.to(panelEl, { y: 40, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 0);
    await run(tl
      .to(win, { left: 0, top: 0, width: W, height: H, borderRadius: 0, outlineWidth: 0, duration: 0.6, ease: 'power4.inOut' }, 0.05)
      .add(() => scene?.release(1.4), 0.3)
      .add(() => onHandoff(), 0.35));
    cleanup();
    root.remove();
  }
}
