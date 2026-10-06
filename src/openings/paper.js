// OPENING "PAPER"
// Empat lembar kertas warna bertumpuk (tinta, pink, biru, hijau). Di lembar teratas ada namamu.
// Sebuah lubang kecil "dipukul" di tengah, lalu tiap lembar terbuka dengan lubang berbentuk
// lingkaran → segi enam → pil → bintang (bentuk-bentuk dari hero 3D), bergantian, dengan
// bayangan keras di tepinya. Hasilnya cincin-cincin warna yang mengembang seperti terowongan kertas.
import gsap from 'gsap';
import { svgEl, removeCover, fontsReady, makeRoot, skippable, COLORS } from './shared.js';

// bentuk lubang, berpusat di (0,0), ukuran ±60 → [path, jari-jari terdalam]
const SHAPES = {
  circle: ['M-50 0a50 50 0 1 0 100 0a50 50 0 1 0-100 0Z', 50],
  hex: [(() => { const p = []; for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i + Math.PI / 6; p.push(`${(Math.cos(a) * 56).toFixed(2)} ${(Math.sin(a) * 56).toFixed(2)}`); } return `M${p.join('L')}Z`; })(), 48],
  pill: ['M-32-30a32 32 0 0 1 64 0v60a32 32 0 0 1-64 0Z', 32],
  star: [(() => { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 28 : 64; const a = (Math.PI / 5) * i - Math.PI / 2; p.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`); } return `M${p.join('L')}Z`; })(), 28],
};

export default async function paperOpening({ scene, popShapes, onHandoff, settings, profile }) {
  const root = makeRoot('paper');
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = W / 2, cy = H / 2;
  const mobile = W < 720;
  const SH = mobile ? 6 : 10; // offset bayangan keras

  // dari bawah ke atas
  const layers = [
    { color: COLORS.green, shape: 'star', rot: 36 },
    { color: COLORS.blue, shape: 'pill', rot: -50 },
    { color: COLORS.pink, shape: 'hex', rot: 30 },
    { color: COLORS.ink, shape: 'circle', rot: 0, top: true },
  ];

  const svg = svgEl('svg', { class: 'opening__paper', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, root);
  const defs = svgEl('defs', {}, svg);
  const holes = [];
  layers.forEach((L, i) => {
    const [d] = SHAPES[L.shape];
    const mHole = svgEl('mask', { id: `op-hole-${i}`, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    svgEl('rect', { width: W, height: H, fill: '#fff' }, mHole);
    const hole = svgEl('path', { d, fill: '#000' }, mHole);
    const mShadow = svgEl('mask', { id: `op-shadow-${i}`, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    svgEl('rect', { width: W, height: H, fill: '#fff' }, mShadow);
    const shadow = svgEl('path', { d, fill: '#000' }, mShadow);
    holes.push({ hole, shadow, s: 0, r: L.rot - 40, inner: SHAPES[L.shape][1] });
  });
  layers.forEach((L, i) => {
    svgEl('rect', { width: W, height: H, fill: COLORS.ink, mask: `url(#op-shadow-${i})` }, svg); // bayangan
    const g = svgEl('g', { mask: `url(#op-hole-${i})` }, svg);
    svgEl('rect', { width: W, height: H, fill: L.color }, g);
    if (L.top) {
      const t = svgEl('text', { x: cx, y: cy, 'text-anchor': 'middle', fill: COLORS.paper, 'font-family': '"Bricolage Grotesque", "Arial Black", sans-serif', 'font-weight': 800, 'font-size': 100, 'letter-spacing': '-3', class: 'opening__paper-name' }, g);
      t.textContent = profile ? `${profile.firstName} ${profile.lastName}` : 'Evan Suryadinata';
      const sub = svgEl('text', { x: cx, y: cy, 'text-anchor': 'middle', fill: COLORS.yellow, 'font-family': '"Instrument Sans", system-ui, sans-serif', 'font-weight': 600, 'font-size': mobile ? 14 : 18, class: 'opening__paper-sub' }, g);
      sub.textContent = (settings.openingCaptions || [])[0] || '';
    }
  });
  removeCover();
  await fontsReady();
  scene?.prepare({ focus: 0 });

  // ukur nama lalu skala agar lebarnya ±72% layar
  const nameEl = root.querySelector('.opening__paper-name');
  const subEl = root.querySelector('.opening__paper-sub');
  const fs = Math.min(140, (100 * W * (mobile ? 0.84 : 0.72)) / nameEl.getComputedTextLength());
  nameEl.setAttribute('font-size', fs);
  nameEl.setAttribute('letter-spacing', String(-0.03 * fs));
  nameEl.setAttribute('y', cy + fs * 0.3);
  subEl.setAttribute('y', cy + fs * 0.3 + (mobile ? 30 : 46));

  const apply = (h) => {
    h.hole.setAttribute('transform', `translate(${cx} ${cy}) rotate(${h.r}) scale(${h.s})`);
    h.shadow.setAttribute('transform', `translate(${cx + SH} ${cy + SH}) rotate(${h.r}) scale(${h.s})`);
  };
  holes.forEach(apply);
  const cover = Math.hypot(W / 2, H / 2) + SH * 2 + 20;

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { root.remove(); resolve(); } });
    skippable(root, tl);
    const name = root.querySelector('.opening__paper-name');
    const sub = root.querySelector('.opening__paper-sub');

    tl.from(name, { y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
      .from(sub, { y: 14, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.3);

    // pukulan pertama: lubang kecil di lembar teratas
    const top = holes[holes.length - 1];
    tl.to(top, { s: 0.42, r: 0, duration: 0.5, ease: 'back.out(3)', onUpdate: () => apply(top) }, 0.95);

    // lubang-lubang mengembang dari atas ke bawah
    const start = 1.55;
    [...holes].reverse().forEach((h, i) => {
      const L = layers[holes.length - 1 - i];
      tl.to(h, { s: cover / h.inner, r: L.rot, duration: 1.15, ease: 'power3.in', onUpdate: () => apply(h) }, start + i * 0.17);
    });
    const handAt = start + (holes.length - 1) * 0.17 + 0.55;
    tl.add(() => { popShapes(); onHandoff(); }, handAt);
  });
}
