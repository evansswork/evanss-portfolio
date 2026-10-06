// ============================================================
//  Titik masuk aplikasi. Urutannya:
//  1. render konten dari content/   2. smooth scroll   3. scene 3D
//  4. fitur-fitur interaktif        5. opening → hero → animasi scroll
// ============================================================
import './styles/main.css';
import gsap from 'gsap';
import { profile } from '../content/profile.js';
import { settings } from '../content/settings.js';
import { experienceGroups } from '../content/experience.js';
import { projects, itProjects } from '../content/projects.js';

import { renderAll } from './core/render.js';
import { initSmoothScroll } from './core/smooth-scroll.js';
import { buildIntro, initScrollAnimations, ScrollTrigger } from './core/animations.js';
import { createHeroScene } from './three/hero-scene.js';
import { OPENINGS, pickOpening, runOpening, openingHandlesNametag } from './openings/index.js';

import { initCursor } from './ui/cursor.js';
import { initMagnetic } from './ui/magnetic.js';
import { initNav } from './ui/nav.js';
import { initStickers } from './sections/hero-stickers.js';
import { initAccordion } from './sections/experience-accordion.js';
import { initTabs } from './sections/work-tabs.js';
import { initTilt } from './ui/tilt.js';
import { initCaseModal } from './dialogs/case-modal.js';
import { initLightbox } from './dialogs/lightbox.js';
import { initBadge } from './ui/badge.js';
import { initSound } from './ui/sound.js';
import { initMarquees } from './ui/marquee.js';
import { initWordmark } from './sections/footer-wordmark.js';
import { initClock } from './sections/footer-clock.js';
import { initOpeningPicker } from './sections/footer-picker.js';
import { initHeadlineRotator } from './sections/hero-headline.js';
import { initFocus, getFocus } from './sections/hero-focus.js';
import { initTimeline } from './sections/experience-timeline.js';
import { initComposer } from './sections/contact-composer.js';
import { initCommandPalette } from './dialogs/command-palette.js';
import { initExperienceLinks } from './sections/experience-links.js';
import { initEvidence } from './sections/skills-evidence.js';
import { checkFiles } from './ui/files.js';
import { skills } from '../content/skills.js';
import { education } from '../content/education.js';
import { certificates } from '../content/certificates.js';
import { initCV } from './dialogs/cv.js';
import { achievements } from '../content/achievements.js';
import { playbook } from '../content/playbook.js';
import { renderAchievements, initAchievementsMotion } from './sections/achievements.js';
import { renderPlaybook, initPlaybookMotion } from './sections/playbook.js';

const F = settings.features || {};

// Mode inspeksi: tambahkan ?slowmo=4 di URL untuk memutar semua animasi GSAP 4× lebih lambat
const slowmo = Number(new URLSearchParams(window.location.search).get('slowmo'));
if (slowmo > 1) gsap.globalTimeline.timeScale(1 / slowmo);

// 1. konten
if (settings.showTodos) document.documentElement.classList.add('show-todos');
renderAll();
renderPlaybook(playbook);
renderAchievements(achievements);
// Tautan CV/PDF yang file-nya belum ada disembunyikan. Kalau CV PDF belum ada,
// tombol hero berubah jadi "View CV" yang membuka CV otomatis (src/dialogs/cv.js).
checkFiles().then((missing) => {
  const btn = document.querySelector('#hero-cv');
  const pdf = document.querySelector('#cv-pdf');
  const cvMissing = !profile.cv || missing.has(profile.cv); // kosong = dihapus saat build karena file-nya belum ada
  if (!cvMissing) { if (pdf) { pdf.href = profile.cv; pdf.hidden = false; } return; }
  if (btn && F.cvSheet !== false) {
    btn.classList.remove('is-missing');
    btn.removeAttribute('aria-disabled');
    btn.removeAttribute('title');
    btn.href = '#cv';
    btn.dataset.cvOpen = '';
    btn.textContent = 'View CV';
  }
});

// Vercel Web Analytics (opsional, lihat content/settings.js)
if (settings.vercelAnalytics) {
  window.va = window.va || function va(...args) { (window.vaq = window.vaq || []).push(args); };
  const s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
}

// 2. smooth scroll (posisi scroll diatur sendiri, bukan oleh browser, supaya tidak berebut dengan Lenis)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const lenis = initSmoothScroll();
lenis?.stop();
window.scrollTo(0, 0);

// 3. 3D hero (kalau WebGL tidak tersedia, situs tetap jalan tanpa 3D)
let scene = null;
try {
  scene = createHeroScene(document.querySelector('#hero-canvas'), { confetti: F.confetti !== false });
} catch (err) {
  console.warn('WebGL tidak tersedia, hero tanpa 3D.', err);
}

// 4. fitur (yang membuat elemen baru dipanggil sebelum initMagnetic)
if (F.composer !== false) initComposer(profile); else document.querySelector('#composer')?.remove();
if (F.timeline !== false) initTimeline(experienceGroups); else document.querySelector('#xp-timeline')?.remove();
const rotator = initHeadlineRotator(F.headlineRotator !== false ? profile.headlines : profile.headlines.slice(0, 1), { interval: profile.headlineInterval });
initExperienceLinks(lenis);
initEvidence({ skills, projects: [...projects, ...itProjects], groups: experienceGroups, lenis });
if (F.cursor !== false) initCursor();
initMagnetic();
initNav(lenis);
initStickers();
initAccordion();
initTabs();
// "Hiring for" (sesudah tab, karena memilih tab Work yang sesuai)
const focus = initFocus({
  profile,
  onChange: (v, initial) => {
    rotator.setFocus(v);
    if (v !== 'all') document.querySelector(`.tabs__btn[data-tab="${v === 'tech' ? 'it' : 'marketing'}"]`)?.click();
    if (!initial) requestAnimationFrame(() => ScrollTrigger.refresh());
  },
});
initTilt();
const caseModal = initCaseModal(lenis);
const cv = F.cvSheet !== false
  ? initCV({ lenis, profile, settings, groups: experienceGroups, projects: [...projects, ...itProjects], education, certificates, skills, achievements, getFocus })
  : { open() {}, openFromHash() {} };
initLightbox();
if (F.sound !== false) initSound();
if (F.scrollBadge !== false) initBadge(lenis);
else document.querySelector('#scroll-badge')?.remove();
if (F.clock !== false) initClock(settings);

// 5. opening
let playing = false;
let firstRun = true;

async function playOpening(name, { replay = false } = {}) {
  if (playing) return;
  playing = true;
  if (replay) {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }
  // Sekali per sesi: kunjungan berikutnya di tab yang sama memutar versi kilat (atau langsung, untuk opening lain)
  let express = false;
  try {
    express = !replay && !new URLSearchParams(window.location.search).get('opening') && sessionStorage.getItem('evan:intro-seen') === '1';
    sessionStorage.setItem('evan:intro-seen', '1');
  } catch {}
  if (express && name !== 'edit') name = 'none';
  lenis?.stop();
  window.dispatchEvent(new Event('opening:start'));
  const intro = buildIntro({ withNametag: !openingHandlesNametag(name) });
  if (name !== 'zoom') scene?.prepare({ focus: 0 });
  await runOpening(name, {
    scene,
    profile,
    settings,
    express,
    popShapes: () => scene?.intro(),
    onHandoff: () => { intro.play(); window.dispatchEvent(new Event('opening:handoff')); },
  });
  lenis?.start();
  playing = false;

  if (firstRun) {
    firstRun = false;
    initPlaybookMotion(lenis); // dibuat sebelum animasi scroll lain karena section-nya di-pin
    initScrollAnimations(scene);
    initAchievementsMotion();
    if (F.velocityMarquee !== false) initMarquees(lenis);
    else initMarquees(lenis, { velocity: false });
    if (F.wordmark !== false) initWordmark({ onReplay: () => playOpening(pickOpening(settings.opening), { replay: true }) });
    else document.querySelector('#wordmark')?.remove();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    caseModal.openFromHash();
    cv.openFromHash();
  }
}

if (settings.openingPicker) initOpeningPicker(OPENINGS, { onPick: (n) => playOpening(n, { replay: true }) });
if (F.commandPalette !== false) {
  initCommandPalette({
    lenis,
    profile,
    projects: [...projects, ...itProjects],
    openCase: (slug) => caseModal.open(slug),
    openCV: F.cvSheet !== false ? () => cv.open() : null,
    setFocus: (v) => focus.set(v),
    replay: () => playOpening(pickOpening(settings.opening), { replay: true }),
  });
}
document.fonts?.ready.then(() => ScrollTrigger.refresh());
playOpening(pickOpening(settings.opening));
