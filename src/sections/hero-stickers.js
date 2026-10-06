// Stiker pil di hero: posisi awal + bisa di-drag dan dilempar (inersia).
// Teks & warna stiker diatur di content/profile.js → stickers.
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { reduced, isStacked } from '../ui/env.js';
import { sfx } from '../ui/sound.js';

gsap.registerPlugin(Draggable, InertiaPlugin);

export function initStickers() {
  const wrap = document.querySelector('#hero-stickers');
  const stickers = [...wrap.querySelectorAll('.sticker')];
  if (!stickers.length) return;
  // posisi dalam persen area hero: [x, y, rotasi]
  const spots = isStacked()
    ? [[6, 68, -8], [58, 78, 6], [22, 90, 4], [62, 64, -5], [10, 80, 7], [44, 70, -6]]
    : [[55, 18, -8], [74, 74, 6], [60, 58, 4], [88, 36, -6], [46, 82, 7], [78, 10, 5]];
  stickers.forEach((el, i) => {
    const [x, y, r] = spots[i % spots.length];
    gsap.set(el, { left: `${x}%`, top: `${y}%`, rotate: r });
  });
  if (reduced) return;
  Draggable.create(stickers, {
    type: 'x,y',
    bounds: wrap,
    inertia: true,
    edgeResistance: 0.75,
    onPress() { gsap.to(this.target, { scale: 1.1, duration: 0.2, ease: 'back.out(2)' }); this.target.style.zIndex = 5; sfx('tick'); },
    onRelease() { gsap.to(this.target, { scale: 1, rotate: `+=${gsap.utils.random(-14, 14)}`, duration: 0.5, ease: 'elastic.out(1, 0.4)' }); sfx('thud'); },
  });
}
