// OPENING "ZOOM" (default)
// 1. Layar tinta gelap. Huruf E-v-a-n muncul satu per satu — tapi hurufnya adalah JENDELA:
//    lewat huruf, kamu melihat hero kuning dengan bentuk 3D yang sedang bergerak (knockout text,
//    mix-blend-mode: multiply → putih = tembus, hitam = tertutup).
// 2. Sebuah titik jatuh dan memantul di ujung kata.
// 3. Kamera menyelam ke dalam titik itu sampai seluruh layar menjadi hero. Bentuk 3D lalu meluncur
//    dari tengah ke posisinya, judul hero masuk.
import gsap from 'gsap';
import { svgEl, removeCover, fontsReady, makeRoot, skippable } from './shared.js';

export default async function zoomOpening({ scene, popShapes, onHandoff, settings }) {
  const word = settings.openingWord || 'Evan';
  const [capL, capR] = settings.openingCaptions || [];
  const root = makeRoot('zoom');
  const W = window.innerWidth;
  const H = window.innerHeight;
  const mobile = W < 720;

  const svg = svgEl('svg', { class: 'opening__knockout', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, root);
  // hitam MURNI: 0 × apa pun = 0, jadi bentuk di belakang tidak membayang di area gelap
  svgEl('rect', { width: W, height: H, fill: '#000' }, svg);
  const mark = svgEl('g', {}, svg);
  // keterangan pojok berada di lapisan TERPISAH (tanpa blend) supaya warnanya tetap murni
  const captions = document.createElement('div');
  captions.className = 'opening__captions';
  captions.setAttribute('aria-hidden', 'true');
  captions.innerHTML = `<span>${capL ?? ''}</span><span>${capR ?? ''}</span>`;
  document.body.appendChild(captions);
  removeCover();

  await fontsReady();

  // ---- susun huruf (ukur di 200px lalu skala agar pas layar)
  const FS0 = 200;
  const letters = [...word].map((ch) => {
    const t = svgEl('text', { 'font-family': '"Bricolage Grotesque", "Arial Black", sans-serif', 'font-weight': 800, 'font-size': FS0, fill: '#fff', x: 0, y: 0 }, mark);
    t.textContent = ch;
    return t;
  });
  const widths = letters.map((t) => t.getComputedTextLength());
  const track = -0.035 * FS0;
  const gap = 0.045 * FS0;
  const r0 = 0.105 * FS0;
  const total0 = widths.reduce((a, b) => a + b, 0) + track * (letters.length - 1) + gap + r0 * 2;
  const k = Math.min((W * (mobile ? 0.86 : 0.74)) / total0, (H * 0.46) / (0.74 * FS0));
  const FS = FS0 * k;
  const baseline = H / 2 + 0.36 * FS;
  let x = (W - total0 * k) / 2;
  letters.forEach((t, i) => {
    t.setAttribute('font-size', FS);
    t.setAttribute('x', x);
    t.setAttribute('y', baseline);
    x += (widths[i] + track) * k;
  });
  const r = r0 * k;
  const cx = x - track * k + gap * k + r;
  const cy = baseline - r;
  const dot = svgEl('circle', { cx, cy, r, fill: '#fff' }, mark);

  // seberapa besar titik harus diperbesar agar menutupi layar (setelah digeser ke tengah)
  const S = (Math.hypot(W / 2, H / 2) / r) * 1.12;

  scene?.prepare({ focus: 1 });

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { root.remove(); captions.remove(); resolve(); } });
    skippable(root, tl);

    // 1. huruf "dibuka" satu per satu, bentuk 3D muncul di baliknya
    tl.add(() => popShapes(), 0.05)
      .from(letters, { scale: 0, rotation: (i) => [-10, 8, -6, 9][i % 4], transformOrigin: '50% 90%', duration: 0.7, ease: 'back.out(1.9)', stagger: 0.09 }, 0.15)
      .from(captions.children, { y: 16, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.5)
      // 2. titik jatuh & memantul
      .from(dot, { attr: { cy: -r * 3 }, duration: 0.75, ease: 'bounce.out' }, 0.7)
      .from(dot, { attr: { r: r * 0.6 }, duration: 0.3, ease: 'power2.out' }, 0.7);

    // 3. menyelam ke titik
    const zoomAt = 1.95;
    tl.to(captions.children, { y: -12, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, zoomAt - 0.1)
      .to(mark, { x: W / 2 - cx, y: H / 2 - cy, duration: 1.0, ease: 'power3.inOut' }, zoomAt)
      .to(mark, { scale: S, svgOrigin: `${cx} ${cy}`, duration: 1.0, ease: 'expo.in' }, zoomAt)
      .add(() => scene?.release(1.5), zoomAt + 0.55)
      .add(() => onHandoff(), zoomAt + 0.7);
  });
}
