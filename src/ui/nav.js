// Navigasi: link yang scroll halus ke section (data-scroll-to) + menu layar penuh di mobile.
import gsap from 'gsap';

export function initNav(lenis) {
  const burger = document.querySelector('#nav-burger');
  const menu = document.querySelector('#nav-menu');
  let open = false;
  const menuTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut' } })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'circle(150% at calc(100% - 2.6rem) 2.3rem)', duration: 0.8 })
    .to('.menu__links a', { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)' }, '-=0.35')
    .from('.menu__foot', { opacity: 0, y: 10, duration: 0.4 }, '-=0.3');
  const setOpen = (v) => {
    open = v;
    burger.classList.toggle('is-open', v);
    burger.setAttribute('aria-expanded', String(v));
    menu.setAttribute('aria-hidden', String(!v));
    v ? menuTl.play() : menuTl.reverse();
    v ? lenis?.stop() : lenis?.start();
  };
  burger.addEventListener('click', () => setOpen(!open));
  document.querySelectorAll('[data-scroll-to]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.dataset.scrollTo);
      if (!target) return;
      e.preventDefault();
      const go = () => (lenis ? lenis.scrollTo(target, { offset: -70, duration: 1.3 }) : target.scrollIntoView({ behavior: 'smooth' }));
      if (open) { setOpen(false); setTimeout(go, 500); } else go();
    });
  });
}
