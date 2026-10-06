// OPENING "SLOT"
// Kata "marketing / creative / code" bergulir seperti mesin slot, lalu pil "Hi, I'm Evan" dibanting
// ke tengah layar dan terbang mengecil ke posisi name tag di hero (GSAP Flip).
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { removeCover, makeRoot, skippable } from './shared.js';

gsap.registerPlugin(Flip);

export const handlesNametag = true; // opening ini yang memunculkan name tag hero

export default async function slotOpening({ popShapes, onHandoff, profile }) {
  const words = ['marketing', 'creative', 'code'];
  const root = makeRoot('slot');
  root.innerHTML = `
    <div class="opening__bg"></div>
    <div class="opening__stage">
      <div class="opening__roll">${words.map((w) => `<span class="opening__word">${w}</span>`).join('')}</div>
      <div class="hero__nametag opening__name"><span class="hero__nametag-dot"></span><span>Hi, I'm <b>${profile?.name ?? 'Evan'}</b></span></div>
      <div class="opening__dots"><i></i><i></i><i></i><i></i></div>
    </div>`;
  removeCover();
  const target = document.querySelector('#hero-nametag');
  const name = root.querySelector('.opening__name');
  gsap.set(target, { autoAlpha: 0 });

  return new Promise((resolve) => {
    const dots = gsap.to(root.querySelectorAll('.opening__dots i'), { y: -9, duration: 0.28, ease: 'power1.inOut', yoyo: true, repeat: -1, stagger: { each: 0.09, yoyo: true, repeat: -1 } });
    const tl = gsap.timeline({ onComplete: () => { root.remove(); resolve(); } });
    skippable(root, tl);

    const STEP = 0.52;
    root.querySelectorAll('.opening__word').forEach((w, i) => {
      const t = 0.1 + i * STEP;
      tl.fromTo(w, { yPercent: 120, rotate: 5, scaleY: 1.25 }, { yPercent: 0, rotate: 0, scaleY: 1, duration: 0.42, ease: 'back.out(1.6)' }, t)
        .to(w, { yPercent: -120, rotate: -5, duration: 0.32, ease: 'power2.in' }, t + STEP - 0.08);
    });
    const stampAt = 0.1 + words.length * STEP + 0.05;
    tl.fromTo(name, { scale: 5, rotate: -14, autoAlpha: 0 }, { scale: 2.3, rotate: -3, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.8)' }, stampAt)
      .to(root.querySelector('.opening__stage'), { x: 3, duration: 0.05, repeat: 3, yoyo: true }, stampAt + 0.12)
      .to(root.querySelector('.opening__dots'), { autoAlpha: 0, duration: 0.25 }, stampAt + 0.2);

    const handAt = stampAt + 0.95;
    tl.add(() => { dots.kill(); popShapes(); onHandoff(); }, handAt)
      .to(root.querySelector('.opening__bg'), { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, handAt)
      .add(() => {
        Flip.fit(name, target, {
          scale: true, duration: 0.95, ease: 'power3.inOut',
          onComplete: () => { gsap.set(target, { autoAlpha: 1 }); gsap.set(name, { autoAlpha: 0 }); },
        });
      }, handAt + 0.05)
      .to({}, { duration: 1.1 }, handAt);
  });
}
