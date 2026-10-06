// CV otomatis dari content/: dua versi (Marketing / Tech), format ATS, dan muat 1 halaman.
//
// Aturan ATS & HR yang dipakai: satu kolom; judul section standar; font standar tanpa ligatur; kontak teks polos;
// tanggal "Mon YYYY – Mon YYYY" / "Present" (dihitung dari start/end); summary tanpa kata ganti "I";
// skill di bagian atas; early-career = 1 halaman.
//
// Auto-fit: CV dirender di elemen tersembunyi selebar halaman A4. Kalau lebih dari satu halaman, detail
// dikurangi bertahap (poin organisasi → poin proyek → poin role → role lama diringkas) sampai muat.
// Tombol "Full" menampilkan versi lengkap. Buka lewat "View CV", Ctrl/⌘ K, #cv, atau #cv-tech.
import gsap from 'gsap';
import { sfx } from '../ui/sound.js';
import { setBackgroundInert } from '../ui/dialog.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const host = (u = '') => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
const clean = (t = '') => String(t).replace(/\s—\s/g, ' – ').replace(/\s·\s/g, ', ');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (v) => { const [y, m] = v.split('-').map(Number); return `${MON[m - 1]} ${y}`; };
// "Feb — Aug 2026" → "Feb 2026 – Aug 2026" (setiap tanggal lengkap bulan + tahun)
function fullRange(period = '') {
  const p = String(period).replace(/\s*[—–]\s*/g, ' – ').trim();
  const m = p.match(/^([A-Z][a-z]{2}) – ([A-Z][a-z]{2}) (\d{4})$/);
  return m ? `${m[1]} ${m[3]} – ${m[2]} ${m[3]}` : p;
}
const roleDates = (x) => (x.start ? `${ym(x.start)} – ${x.end ? ym(x.end) : 'Present'}` : fullRange(x.period));
const months = (x) => {
  const [y1, m1] = x.start.split('-').map(Number);
  const end = x.end ? x.end.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  return (end[0] - y1) * 12 + (end[1] - m1) + 1;
};
// poin terbaik = yang paling banyak angkanya (11 tournaments, 4 podium → 2)
const score = (p) => (String(p).match(/\d+(?:[.,]\d+)?/g) || []).length;
const best = (list) => list.reduce((a, b) => (score(b) > score(a) ? b : a), list[0]);
function pickPoints(x) {
  const pts = x.points || [];
  if (!pts.length) return [];
  if (x.type === 'org' || (x.start && months(x) <= 3)) return [score(best(pts)) ? best(pts) : pts[0]];
  const rest = pts.slice(1);
  return [pts[0], rest.length && score(best(rest)) ? best(rest) : rest[0]].filter(Boolean);
}
function siteUrl(settings) {
  if (settings.siteUrl) return settings.siteUrl;
  const h = window.location.hostname;
  return h && !/localhost|127\.0\.0\.1|claude|anthropic|usercontent/.test(h) ? window.location.origin : '';
}

// tingkat detail, dari paling lengkap ke paling ringkas
// Tingkat detail, dari paling lengkap ke paling ringkas. Urutannya disengaja: ringkas bagian pendukung dulu
// (organisasi, proyek, soft skills), lalu kurangi jumlah role detail (yang paling relevan tetap), baru kurangi poin.
// role: poin per role ('smart' = 2 untuk role panjang, 1 untuk role singkat) · detailed: jumlah role detail
// org/proj: poin · compact*: jadi satu paragraf · soft: soft skills · extraSkills: baris skill di luar fokus versi
const BASE = { role: 'smart', org: 1, proj: 1, detailed: Infinity, compactOrg: false, compactProj: false, soft: true, extraSkills: true, projects: true, size: 10 };
const LEVELS = [
  {},
  { org: 0 },
  { org: 0, proj: 0, compactOrg: true },
  { org: 0, proj: 0, compactOrg: true, compactProj: true },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 6 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 5 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 4 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 4, size: 9.5 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 3, size: 9.5 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 3, role: 1, size: 9.5 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 2, role: 1, size: 9.5 },
  { org: 0, proj: 0, compactOrg: true, compactProj: true, soft: false, extraSkills: false, projects: false, detailed: 0, role: 0, size: 9.5 },
].map((l) => ({ ...BASE, ...l }));
// relevansi role untuk CV: angka pencapaian di poinnya + senioritas + durasi (maks. 12 bulan)
const relevance = (x) => (x.points || []).reduce((n, pt) => n + score(pt), 0) + (/\b(head|lead|manager)\b/i.test(x.role) ? 3 : 0) + (x.start ? Math.min(months(x), 12) / 4 : 0);
const ORDER = {
  marketing: ['summary', 'skills', 'experience', 'achievements', 'leadership', 'projects', 'education', 'certifications'],
  tech: ['summary', 'skills', 'projects', 'education', 'achievements', 'experience', 'leadership', 'certifications'],
};

function renderCV(data, version, L) {
  const { profile, settings, groups, projects, education, certificates, skills, achievements = [] } = data;
  const v = profile.cvVersions?.[version] || { title: profile.cvTitle || '', summary: (profile.bio || [])[0] || '' };
  const tech = version === 'tech';
  const C = profile.contacts || {};
  const phone = (profile.socials || []).find((s) => s.label === 'WhatsApp')?.handle;
  const site = siteUrl(settings);
  const roles = groups.flatMap((g) => g.items).filter((x) => x.start)
    .sort((a, b) => (b.end || '9999-99').localeCompare(a.end || '9999-99') || b.start.localeCompare(a.start));
  const work = roles.filter((x) => x.type !== 'org');
  const org = roles.filter((x) => x.type === 'org');
  const roleIds = new Set(roles.map((x) => x.id));
  const cases = projects.filter((p) => p.caseStudy && p.slug !== 'portfolio-site' && !roleIds.has(p.slug));
  const wins = achievements.filter((a) => !a.todo);
  const byIssuer = certificates.reduce((m, c) => ((m[c.issuer] = m[c.issuer] || []).push(`${c.title} (${c.year})`), m), {});
  const stickers = (skills.stickers || []).map((s) => (typeof s === 'string' ? { label: s } : s));
  const tools = skills.tools || [];
  const skillSets = {
    marketing: ['Marketing & content', stickers.filter((s) => !s.cv).map((s) => s.label)],
    technical: ['Technical', [...tools.filter((t) => t.kind === 'code').map((t) => t.name), ...stickers.filter((s) => s.cv === 'tech').map((s) => s.label)]],
    platforms: ['Platforms & tools', tools.filter((t) => t.kind !== 'code').map((t) => t.name)],
    soft: ['Soft skills', stickers.filter((s) => s.cv === 'soft').map((s) => s.label)],
  };
  const skillOrder = (tech ? ['technical', 'platforms', 'marketing', 'soft'] : ['marketing', 'platforms', 'technical', 'soft'])
    .filter((k) => k !== 'soft' || L.soft)
    .filter((k) => L.extraSkills || (tech ? k !== 'marketing' : k !== 'technical'));
  const contact = [C.email, phone, C.linkedin && host(C.linkedin).replace('www.', ''), C.github && host(C.github), site && host(site), profile.location].filter(Boolean);
  // satu poin saja → ambil yang berangka (pencapaian), bukan kalimat deskripsi
  const one = (x) => { const pts = x.points || []; return pts.length ? [score(best(pts)) ? best(pts) : pts[0]] : []; };
  const bullets = (x) => (L.role === 0 ? [] : tech || L.role === 1 ? one(x) : pickPoints(x));
  const list = (items) => (items.length ? `<ul class="cvs__pts">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '');
  // role detail = yang paling relevan, tetap ditampilkan berurutan waktu (terbaru dulu)
  const top = new Set([...work].sort((a, b) => relevance(b) - relevance(a)).slice(0, tech ? Math.min(L.detailed, 2) : L.detailed));
  const detailed = work.filter((x) => top.has(x));
  const extra = work.filter((x) => !top.has(x));
  const projBullets = tech ? 1 : L.proj;

  const parts = {
    summary: `<section><h2>Summary</h2><p>${esc(v.summary)}</p></section>`,
    skills: `<section><h2>Skills</h2>${skillOrder.filter((k) => skillSets[k][1].length).map((k) => `<p class="cvs__line"><b>${esc(skillSets[k][0])}:</b> ${esc(skillSets[k][1].join(', '))}</p>`).join('')}${profile.languages?.length ? `<p class="cvs__line"><b>Languages:</b> ${esc(profile.languages.join(', '))}</p>` : ''}</section>`,
    experience: `<section><h2>Experience</h2>${detailed.map((x) => `
      <div class="cvs__item">
        <p class="cvs__row"><span class="cvs__what"><b>${esc(x.role)}</b>, ${esc(clean(x.company))} | ${esc(clean(x.location))}</span><span class="cvs__date">${esc(roleDates(x))}</span></p>${list(bullets(x))}
      </div>`).join('')}${extra.length ? `<p class="cvs__line"><b>${detailed.length ? 'Additional experience' : 'Roles'}:</b> ${esc(extra.map((x) => `${x.role}, ${clean(x.short || x.company)} (${roleDates(x)})`).join('; '))}</p>` : ''}</section>`,
    // versi Marketing boleh menghilangkan proyek coding saat ruang habis; versi Tech selalu menampilkannya
    projects: !cases.length || (!tech && !L.projects) ? '' : L.compactProj && !tech
      ? `<section><h2>Projects</h2><p class="cvs__line">${esc(cases.map((p) => `${p.title}: ${p.category}${p.stack ? ` (${p.stack.join(', ')})` : ''}, ${fullRange(p.year)}`).join('; '))}</p></section>`
      : `<section><h2>Projects</h2>${cases.map((p) => `
      <div class="cvs__item cvs__item--tight">
        <p class="cvs__row"><b>${esc(p.title)}</b><span>${esc(fullRange(p.year))}</span></p>
        <p class="cvs__sub">${esc(clean(p.caseStudy.role || p.category))}${!projBullets && p.stack ? `. Tech: ${esc(p.stack.join(', '))}` : ''}</p>
        ${projBullets ? list([`${p.description}${p.stack ? ` Tech: ${p.stack.join(', ')}.` : ''}`]) : ''}
      </div>`).join('')}</section>`,
    leadership: !org.length ? '' : L.compactOrg
      ? `<section><h2>Leadership & Activities</h2><p class="cvs__line">${esc(org.map((x) => `${x.role}, ${clean(x.short || x.company)} (${roleDates(x)})`).join('; '))}</p></section>`
      : `<section><h2>Leadership & Activities</h2>${org.map((x) => `
      <div class="cvs__item cvs__item--tight">
        <p class="cvs__row"><b>${esc(x.role)}, ${esc(clean(x.short || x.company))}</b><span>${esc(roleDates(x))}</span></p>
        ${L.org ? `<p class="cvs__sub">${esc(pickPoints(x)[0] || '')}</p>` : ''}
      </div>`).join('')}</section>`,
    achievements: wins.length ? `<section><h2>Achievements</h2>${list(wins.map((a) => `${clean(a.title)}, ${clean(a.issuer)} (${clean(a.year)})`))}</section>` : '',
    education: `<section><h2>Education</h2>${education.filter((e) => e.inCV !== false).map((e) => `
      <div class="cvs__item cvs__item--tight">
        <p class="cvs__row"><b>${esc(clean(e.degree))}, ${esc(e.school)}</b><span>${esc(clean(e.period))}</span></p>
      </div>`).join('')}</section>`,
    certifications: `<section><h2>Certifications</h2>${Object.entries(byIssuer).map(([issuer, items]) => `<p class="cvs__line"><b>${esc(issuer)}:</b> ${esc(items.join('; '))}</p>`).join('')}</section>`,
  };
  return `
    <header class="cvs__head">
      <h1>${esc(profile.name)}</h1>
      <p class="cvs__title">${esc(v.title)}</p>
      <p class="cvs__contact">${contact.map((c) => esc(c)).join(' | ')}</p>
    </header>
    ${ORDER[tech ? 'tech' : 'marketing'].map((k) => parts[k]).join('')}`;
}

// ukur di elemen tersembunyi selebar halaman cetak (A4, margin 12 mm kiri-kanan, 11 mm atas-bawah)
function fitToOnePage(data, version) {
  const probe = document.createElement('div');
  probe.className = 'cv__sheet cvs cv__probe';
  probe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(probe);
  const limit = ((297 - 22) * 96) / 25.4 - 10;
  let result = null;
  for (const L of LEVELS) {
    probe.style.setProperty('font-size', `${L.size}pt`, 'important');
    probe.innerHTML = renderCV(data, version, L);
    result = { html: probe.innerHTML, size: L.size };
    if (probe.scrollHeight <= limit) break;
  }
  probe.remove();
  return result;
}

export function initCV(data) {
  const root = document.querySelector('#cv');
  if (!root) return { open() {}, openFromHash() {} };
  const sheet = root.querySelector('#cv-sheet');
  const scroller = root.querySelector('.cv__scroll');
  const { lenis } = data;
  let open = false, hadStopped = false, pushed = false, version = 'marketing', length = 'page', savedTitle = '';

  const hashFor = (v) => (v === 'tech' ? '#cv-tech' : '#cv');
  const versionFromHash = () => (location.hash === '#cv-tech' ? 'tech' : location.hash === '#cv' ? 'marketing' : null);
  const paint = () => {
    const r = length === 'full' ? { html: renderCV(data, version, LEVELS[0]), size: 10 } : fitToOnePage(data, version);
    sheet.innerHTML = r.html;
    sheet.style.fontSize = `${r.size}pt`;
    root.querySelectorAll('[data-cv-version]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cvVersion === version)));
    root.querySelectorAll('[data-cv-length]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cvLength === length)));
    // nama file default saat "Save as PDF" mengikuti judul halaman
    document.title = `${data.profile.name.replace(/\s+S$/, '').replace(/\s+/g, '-')}-CV-${version === 'tech' ? 'Tech' : 'Marketing'}`;
  };

  // tampilkan / sembunyikan tanpa menyentuh riwayat
  const show = (v) => {
    if (v) version = v;
    if (open) { paint(); return; }
    open = true;
    savedTitle = document.title;
    paint();
    hadStopped = !!lenis?.isStopped;
    lenis?.stop();
    document.documentElement.classList.add('cv-open');
    setBackgroundInert(true);
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    scroller.scrollTop = 0;
    sfx('open');
    gsap.timeline()
      .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
      .fromTo(sheet, { y: 60, rotate: 1.5, autoAlpha: 0 }, { y: 0, rotate: 0, autoAlpha: 1, duration: 0.65, ease: 'back.out(1.3)' }, '-=0.05');
    root.querySelector('[data-cv-print]')?.focus({ preventScroll: true });
  };
  const hideNow = () => {
    if (!open) return;
    open = false;
    document.title = savedTitle;
    setBackgroundInert(false);
    gsap.to(root, { autoAlpha: 0, duration: 0.25, onComplete: () => {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('cv-open');
    } });
    if (!hadStopped) lenis?.start();
  };
  // aksi pengguna: membuka menambah entri riwayat, jadi tombol Back menutup CV
  const openSheet = (v) => {
    if (open) { show(v); history.replaceState(history.state, '', hashFor(version)); return; }
    show(v);
    history.pushState({ cv: true }, '', hashFor(version));
    pushed = true;
  };
  const hide = () => {
    if (!open) return;
    if (pushed) { pushed = false; history.back(); return; }
    if (versionFromHash()) history.replaceState(history.state, '', location.pathname + location.search);
    hideNow();
  };
  const sync = () => {
    const v = versionFromHash();
    if (v) show(v);
    else if (open) { pushed = false; hideNow(); }
  };
  window.addEventListener('popstate', sync);
  window.addEventListener('hashchange', sync);

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-cv-open]');
    if (opener) { e.preventDefault(); openSheet(opener.dataset.cvOpen || data.getFocus?.() || version); return; }
    if (e.target.closest('[data-cv-close]')) { hide(); return; }
    if (e.target.closest('[data-cv-print]')) { window.print(); return; }
    const vb = e.target.closest('[data-cv-version]');
    if (vb && open) { version = vb.dataset.cvVersion; history.replaceState(history.state, '', hashFor(version)); paint(); sfx('tick'); gsap.from(sheet, { y: 10, autoAlpha: 0.4, duration: 0.3 }); return; }
    const lb = e.target.closest('[data-cv-length]');
    if (lb && open) { length = lb.dataset.cvLength; paint(); sfx('tick'); gsap.from(sheet, { y: 10, autoAlpha: 0.4, duration: 0.3 }); }
  });
  document.addEventListener('keydown', (e) => { if (open && e.key === 'Escape' && !document.querySelector('#cmdk.is-open')) hide(); });
  scroller.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  scroller.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });

  return {
    open: (v) => openSheet(v || data.getFocus?.() || 'marketing'),
    openFromHash() { const v = versionFromHash(); if (v) show(v); },
  };
}
