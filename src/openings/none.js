// OPENING "NONE" — langsung ke hero (penutup memudar cepat).
import gsap from 'gsap';

export default async function noOpening({ popShapes, onHandoff }) {
  const cover = document.querySelector('#opening-cover');
  popShapes();
  onHandoff();
  if (cover) await gsap.to(cover, { autoAlpha: 0, duration: 0.4 }).then(() => cover.remove());
}
