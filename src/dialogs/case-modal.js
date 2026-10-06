// Case study modal: klik kartu proyek (atau elemen apa pun dengan data-case="<slug>").
// Berisi role, kontribusi, hasil, grafik, galeri bukti, link, tombol salin link, dan navigasi
// ke case sebelumnya/berikutnya (juga tombol ← / → di keyboard).
//
// Riwayat browser: membuka dari klik menambah entri (#case-<slug>), jadi tombol Back menutup modal;
// pindah case mengganti entri; membuka link #case-… (ditempel, Back/Forward) membuka modal yang sesuai.
import gsap from 'gsap';
import { renderCase, caseOrder } from '../core/render.js';
import { sfx } from '../ui/sound.js';
import { toast } from '../ui/toast.js';
import { setBackgroundInert } from '../ui/dialog.js';

const slugFromHash = () => {
  const m = window.location.hash.match(/^#case-([\w-]+)$/);
  return m && caseOrder.includes(m[1]) ? m[1] : null;
};
const clearHash = () => history.replaceState(history.state, '', window.location.pathname + window.location.search);

export function initCaseModal(lenis) {
  const modal = document.querySelector('#modal');
  const panel = modal.querySelector('.modal__panel');
  const content = document.querySelector('#modal-content');
  let open = false, current = null, lastFocus = null, pushed = false;

  const fill = (slug) => {
    const data = renderCase(slug);
    if (!data) return null;
    current = slug;
    content.innerHTML = data.html;
    const proof = content.querySelector('[data-proof-block]');
    data.gallery.forEach((g, i) => {
      const li = content.querySelector(`[data-shot-li="${i}"]`);
      data.optionalImage(content.querySelector(`[data-shot="${i}"]`), g.src, g.caption, {
        onLoad: () => { li?.classList.remove('is-todo'); proof?.classList.remove('is-todo'); },
      });
    });
    panel.scrollTop = 0;
    return data;
  };
  const animateInside = (delay = 0) => {
    gsap.from(content.children, { y: 18, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay });
    const bars = content.querySelectorAll('.chart__bar');
    if (!bars.length) return;
    gsap.from(bars, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'back.out(1.5)', stagger: 0.09, delay: delay + 0.35 });
    gsap.from(content.querySelectorAll('.chart__val'), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.09, delay: delay + 0.75 });
  };

  // ---------- tampilkan / sembunyikan (tanpa menyentuh riwayat) ----------
  const show = (slug, trigger) => {
    if (!fill(slug)) return false;
    lastFocus = trigger || document.activeElement;
    open = true;
    sfx('open');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setBackgroundInert(true);
    lenis?.stop();
    gsap.timeline()
      .fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
      .fromTo(panel, { y: 60, autoAlpha: 0, rotate: 1 }, { y: 0, autoAlpha: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.1');
    animateInside(0.25);
    modal.querySelector('.modal__close').focus({ preventScroll: true });
    return true;
  };
  const hide = () => {
    if (!open) return;
    open = false;
    current = null;
    gsap.timeline({ onComplete: () => { modal.setAttribute('aria-hidden', 'true'); modal.classList.remove('is-open'); setBackgroundInert(false); lenis?.start(); lastFocus?.focus?.({ preventScroll: true }); } })
      .to(panel, { y: 40, autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
      .to(modal, { autoAlpha: 0, duration: 0.25 }, '-=0.1');
  };
  const swap = (slug) => {
    if (!slug || slug === current) return;
    sfx('tick');
    current = slug;
    gsap.to(content, { autoAlpha: 0, y: -10, duration: 0.18, ease: 'power2.in', onComplete: () => {
      fill(slug);
      gsap.set(content, { autoAlpha: 1, y: 0 });
      animateInside(0);
    } });
  };

  // ---------- aksi pengguna (mengatur riwayat) ----------
  const openCase = (slug, trigger) => {
    if (open) { history.replaceState(history.state, '', `#case-${slug}`); return swap(slug); }
    if (show(slug, trigger)) { history.pushState({ case: slug }, '', `#case-${slug}`); pushed = true; }
  };
  const close = () => {
    if (!open) return;
    if (pushed) { pushed = false; history.back(); return; } // popstate di bawah yang menutup
    clearHash();
    hide();
  };
  const step = (dir) => {
    const slug = content.querySelector(dir > 0 ? '.case__navbtn--next' : '.case__navbtn--prev')?.dataset.caseGo;
    if (slug) { history.replaceState(history.state, '', `#case-${slug}`); swap(slug); }
  };

  // ---------- riwayat browser & link yang ditempel ----------
  const syncWithLocation = () => {
    const slug = slugFromHash();
    if (slug && !open) show(slug, null);
    else if (slug && open) swap(slug);
    else if (!slug && open) { pushed = false; hide(); }
  };
  window.addEventListener('popstate', syncWithLocation);
  window.addEventListener('hashchange', syncWithLocation);

  document.addEventListener('click', async (e) => {
    const go = e.target.closest('[data-case-go]');
    if (go) { e.preventDefault(); history.replaceState(history.state, '', `#case-${go.dataset.caseGo}`); return swap(go.dataset.caseGo); }
    const share = e.target.closest('[data-case-share]');
    if (share) {
      const url = `${location.origin}${location.pathname}#case-${share.dataset.caseShare}`;
      try { await navigator.clipboard.writeText(url); toast('Link copied. Paste it anywhere.'); } catch { toast(url); }
      return;
    }
    const card = e.target.closest('[data-case]');
    if (card) { e.preventDefault(); return openCase(card.dataset.case, card); }
    if (e.target.closest('[data-modal-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!open || document.querySelector('#lightbox.is-open, #cmdk.is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
  // scroll di dalam modal jangan diteruskan ke smooth scroll halaman
  panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  panel.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });

  return {
    open: (slug) => openCase(slug, document.activeElement),
    // dipanggil sekali setelah opening: buka modal kalau halaman dibuka dengan #case-<slug>
    openFromHash() {
      const slug = slugFromHash();
      if (!slug) return;
      const card = document.querySelector(`.project__card[data-case="${slug}"]`);
      if (card) lenis?.scrollTo(card.closest('section'), { offset: -70, immediate: true });
      show(slug, card);
    },
  };
}
