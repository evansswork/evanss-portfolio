// Mengisi HTML dari file-file di content/. Tidak perlu diedit untuk ganti konten.
import { profile } from '../../content/profile.js';
import { experienceGroups } from '../../content/experience.js';
import { projects, itProjects, moreWork } from '../../content/projects.js';
import { skills } from '../../content/skills.js';
import { icons } from '../../content/icons.js';
import { education } from '../../content/education.js';
import { certificates } from '../../content/certificates.js';

const $ = (sel) => document.querySelector(sel);
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const initials = (name) => name.split(/[\s·&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const COLORS = ['yellow', 'pink', 'blue', 'green', 'orange'];

// Gambar opsional: kalau file ada → tampil, kalau tidak → fallback (inisial / cover otomatis / placeholder).
// Dimuat saat bagian halamannya mendekati layar. Sengaja TIDAK memakai loading="lazy": gambar disembunyikan
// (display:none) sampai berhasil dimuat, dan browser tidak pernah memuat gambar lazy yang tersembunyi.
function optionalImage(container, src, alt = '', { onLoad, onError } = {}) {
  if (!container || !src) return;
  const img = container.querySelector('img') || container.appendChild(document.createElement('img'));
  img.alt = alt;
  img.decoding = 'async';
  const load = () => {
    img.addEventListener('load', () => { container.classList.add('has-image'); onLoad?.(); }, { once: true });
    img.addEventListener('error', () => { container.classList.remove('has-image'); onError?.(); }, { once: true });
    img.src = src;
  };
  const watch = container.closest('section, footer') || container;
  if (!('IntersectionObserver' in window) || container.closest('.modal__panel')) return load();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin: '800px 0px' });
  io.observe(watch);
}
function marquee(container, items) {
  const html = items.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join('');
  container.innerHTML = html + html;
}
const isLight = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
};

// Cover otomatis untuk proyek tanpa gambar (atau sebagai cadangan kalau gambar gagal dimuat)
const CODE_LINES = [[0, 46, 'pink'], [1, 62, 'blue'], [2, 38, 'green'], [2, 54, 'yellow'], [1, 30, 'paper'], [0, 22, 'pink'], [0, 58, 'blue'], [1, 44, 'green'], [2, 34, 'yellow']];
function coverArt(p, i) {
  const tone = p.accent || COLORS[i % COLORS.length];
  if (p.coverStyle === 'code') {
    const lines = CODE_LINES.map(([indent, w, c]) => `<i style="--in:${indent};--w:${w}%;--c:var(--${c})"></i>`).join('');
    return `<div class="cover-art cover-art--code tone--${tone}" aria-hidden="true"><div class="ca-window"><div class="ca-bar"><i></i><i></i><i></i><span>${esc(p.file || p.slug)}</span></div><div class="ca-lines">${lines}</div></div></div>`;
  }
  return `<div class="cover-art cover-art--poster cover-art--v${i % 2} tone--${tone}" aria-hidden="true"><i class="ca-shape ca-shape--circle"></i><i class="ca-shape ca-shape--star"></i><i class="ca-shape ca-shape--pill"></i><b class="ca-title">${esc(p.title)}</b></div>`;
}
function browserFrame(p) {
  return `<div class="browser" aria-hidden="true"><div class="browser__bar"><i></i><i></i><i></i><span>${esc(p.url || '')}</span></div><div class="browser__view" data-cover="${esc(p.slug)}"></div></div>`;
}

function projectCard(p, i) {
  const hasCase = !!p.caseStudy;
  const style = p.coverStyle || 'image';
  const attrs = hasCase ? `href="#case-${esc(p.slug)}" data-case="${esc(p.slug)}"` : p.link ? `href="${esc(p.link)}" target="_blank" rel="noopener"` : `href="#" aria-disabled="true"`;
  return `
    <article class="project project--${p.size || 'normal'}" data-reveal>
      <a class="project__card" ${attrs} data-cursor="${hasCase ? 'Case study' : p.link ? 'Open' : 'Soon'}">
        <div class="project__cover project__cover--${style} tone--${p.accent || COLORS[i % COLORS.length]}" ${style === 'image' ? `data-cover="${esc(p.slug)}"` : ''}>
          ${style === 'browser' ? browserFrame(p) : coverArt(p, i)}
          ${p.placeholder ? '<span class="project__badge">Details coming soon</span>' : ''}
          <span class="project__result">${esc(p.result)}</span>
        </div>
        <div class="project__info">
          <div class="project__top">
            <div><h3 class="project__title">${esc(p.title)}</h3><p class="project__cat">${esc(p.category)}</p></div>
            <span class="project__year">${esc(p.year)}</span>
          </div>
          <p class="project__desc">${esc(p.description)}</p>
          ${p.stack ? `<div class="project__stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
          <span class="project__cta link ${hasCase || p.link ? '' : 'link--muted'}">${hasCase ? 'Open case study' : p.link ? 'Open link' : 'Case study coming soon'}</span>
        </div>
      </a>
    </article>`;
}

// Grafik batang untuk case study (data di content/projects.js → caseStudy.charts)
function fmtValue(v, ch) {
  if (ch.format === 'compact') return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  const d = ch.decimals ?? 0;
  return `${ch.prefix || ''}${Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}${ch.suffix || ''}`;
}
function chartsHtml(charts = []) {
  if (!charts.length) return '';
  return `<div class="case__charts">${charts
    .map((ch) => {
      const vals = ch.data.map((d) => d[1]);
      const max = Math.max(...vals);
      const first = vals[0], last = vals[vals.length - 1];
      const growth = ch.delta === false || vals.length < 2 || !first ? '' :
        `<span class="chart__delta">${last >= first ? '+' : ''}${Math.round(((last - first) / first) * 100)}% from ${esc(ch.data[0][0])} to ${esc(ch.data[vals.length - 1][0])}</span>`;
      return `<figure class="chart">
        <figcaption class="chart__head"><b>${esc(ch.title)}</b>${growth}</figcaption>
        <div class="chart__bars" style="--n:${vals.length}">${ch.data.map(([, v]) => `<div class="chart__col"><span class="chart__val">${esc(fmtValue(v, ch))}</span><i class="chart__bar" style="--h:${Math.max(6, (v / max) * 100).toFixed(1)}%"></i></div>`).join('')}</div>
        <div class="chart__labels" style="--n:${vals.length}">${ch.data.map(([l]) => `<span>${esc(l)}</span>`).join('')}</div>
        ${ch.note ? `<p class="chart__note">${esc(ch.note)}</p>` : ''}
      </figure>`;
    })
    .join('')}</div>`;
}

// Isi modal case study dari data proyek.
// Penanda belum-diisi ('TODO:' / todo: true / gambar yang belum ada / link kosong) diberi kelas is-todo:
// disembunyikan untuk pengunjung, terlihat saat mode "Show todos" aktif.
const ALL = [...projects, ...itProjects];
export const caseOrder = ALL.filter((p) => p.caseStudy).map((p) => p.slug);
const isTodo = (t) => /^TODO:/i.test(String(t));
const stripTodo = (t) => String(t).replace(/^TODO:\s*/i, '');
const TODO_TAG = '<b class="todo-tag">TODO</b>';

export function renderCase(slug) {
  const p = ALL.find((x) => x.slug === slug);
  if (!p?.caseStudy) return null;
  const c = p.caseStudy;
  const contributions = c.contributions || [];
  const results = c.results || [];
  const allDidTodo = contributions.length > 0 && contributions.every(isTodo);
  const allResTodo = results.length > 0 && results.every((r) => r.todo);
  const i = caseOrder.indexOf(slug);
  const prev = ALL.find((x) => x.slug === caseOrder[(i - 1 + caseOrder.length) % caseOrder.length]);
  const next = ALL.find((x) => x.slug === caseOrder[(i + 1) % caseOrder.length]);
  const html = `
    <div class="case__head">
      <span class="case__cat">${esc(p.category)}</span>
      <h2 class="case__title" id="modal-title">${esc(p.title)}</h2>
      <p class="case__meta">${esc(c.role)} · ${esc(p.year)}</p>
      <div class="case__headrow">
        ${p.stack ? `<div class="project__stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
        <button class="case__share" data-case-share="${esc(p.slug)}">Copy link to this case</button>
      </div>
    </div>
    <dl class="case__tldr">
      <div><dt>Role</dt><dd>${esc(String(c.role || '').split(' · ')[0])}</dd></div>
      ${c.challenge ? `<div><dt>Challenge</dt><dd>${esc(c.challenge)}</dd></div>` : ''}
      <div><dt>Outcome</dt><dd>${(() => { const r = results.find((x) => !x.todo); return r ? `<b>${esc(r.value)}</b> ${esc(r.label)}` : esc(p.result); })()}</dd></div>
    </dl>
    <p class="case__summary">${esc(c.summary)}</p>
    ${c.todo ? `<p class="case__todo is-todo">${TODO_TAG}${esc(c.todo)}</p>` : ''}
    ${contributions.length || results.length ? `<div class="case__grid">
      ${contributions.length ? `<div class="${allDidTodo ? 'is-todo' : ''}">
        <h3 class="case__h">What I did</h3>
        <ul class="case__list">${contributions.map((x) => (isTodo(x) ? `<li class="is-todo">${TODO_TAG}${esc(stripTodo(x))}</li>` : `<li>${esc(x)}</li>`)).join('')}</ul>
      </div>` : ''}
      ${results.length ? `<div class="${allResTodo ? 'is-todo' : ''}">
        <h3 class="case__h">Results</h3>
        <ul class="case__results">${results.map((r) => `<li class="${r.todo ? 'is-todo' : ''}"><b>${esc(r.value)}</b><span>${esc(r.label)}</span></li>`).join('')}</ul>
      </div>` : ''}
    </div>` : ''}
    ${chartsHtml(c.charts)}
    ${c.gallery?.length ? `<div class="case__proof is-todo" data-proof-block>
      <h3 class="case__h">Proof</h3>
      <ul class="case__gallery">${c.gallery
        .map((g, k) => `<li class="is-todo" data-shot-li="${k}"><figure class="case__shot" data-shot="${k}"><img alt="${esc(g.caption)}" /><span class="case__shot-ph">Screenshot<br><code>${esc(g.src.replace('/images/projects/', ''))}</code></span><figcaption>${esc(g.caption)}</figcaption></figure></li>`)
        .join('')}</ul>
    </div>` : ''}
    ${c.links?.length ? `<div class="case__links">${c.links.map((l) => (l.href ? `<a class="btn btn--small" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>` : `<span class="btn btn--small btn--disabled is-todo" title="Link belum diisi">${esc(l.label)} · soon</span>`)).join('')}</div>` : ''}
    ${caseOrder.length > 1 ? `<nav class="case__nav" aria-label="More case studies">
      <button class="case__navbtn case__navbtn--prev" data-case-go="${esc(prev.slug)}"><small>Previous case</small><b>${esc(prev.title)}</b></button>
      <button class="case__navbtn case__navbtn--next" data-case-go="${esc(next.slug)}"><small>Next case</small><b>${esc(next.title)}</b></button>
    </nav>` : ''}`;
  return { html, gallery: c.gallery || [], title: p.title, optionalImage };
}

export function renderAll() {
  // ---------- Hero ----------
  $('#hero-name').textContent = profile.name;
  if (profile.avatar) {
    const tag = $('#hero-nametag');
    const img = document.createElement('img');
    img.className = 'hero__nametag-avatar';
    img.alt = '';
    img.addEventListener('load', () => tag.classList.add('has-avatar'), { once: true });
    img.src = profile.avatar;
    tag.prepend(img);
  }
  const heads = profile.headlines?.length ? profile.headlines : [{ lead: 'Content that', punch: 'actually sells.', color: 'pink' }];
  const title = $('#hero-title');
  title.setAttribute('aria-label', `${heads[0].lead} ${heads[0].punch}`);
  title.innerHTML =
    `<span class="line-mask" data-hero-line aria-hidden="true"><span class="word"><span data-lead>${esc(heads[0].lead)}</span></span></span>` +
    `<span class="line-mask" data-hero-line aria-hidden="true"><span class="word"><em data-punch data-color="${esc(heads[0].color || 'pink')}">${esc(heads[0].punch)}</em></span></span>`;
  $('#hero-lede').textContent = profile.tagline;
  $('#hero-cv').href = profile.cv || '#cv';
  $('#hero-stickers').innerHTML = profile.stickers
    .map((s, i) => `<span class="sticker sticker--${s.color}" data-sticker="${i}">${esc(s.text)}</span>`)
    .join('');
  marquee($('#marquee-roles'), profile.marquee);
  if ($('#marquee-label')) $('#marquee-label').textContent = profile.marqueeLabel || '';

  // ---------- About ----------
  $('#about-bio').innerHTML = profile.bio.map((p) => `<p>${esc(p)}</p>`).join('');
  if (profile.photoCutout) $('#about-photo').classList.add('about__photo--cutout');
  optionalImage($('#about-photo'), profile.photo, profile.name);
  $('#stats').innerHTML = profile.stats
    .map((st) => {
      const [kind, ref] = String(st.proof || '').split(':');
      const attrs = kind === 'case' ? `href="#case-${esc(ref)}" data-case="${esc(ref)}"` : kind === 'xp' ? `href="#experience" data-xp="${esc(ref)}"` : '';
      const tag = attrs ? 'a' : 'div';
      return `
      <li data-reveal>
        <${tag} class="stat" ${attrs} ${attrs ? 'data-cursor="Proof"' : ''}>
          <div class="stat__value">${st.prefix ? `<sup>${esc(st.prefix)}</sup>` : ''}<span data-count="${st.value}" data-decimals="${st.decimals}">0</span><sup>${esc(st.suffix)}</sup></div>
          <div class="stat__label">${esc(st.label)}</div>
          <div class="stat__note">${esc(st.note)}</div>
          ${attrs ? '<span class="stat__proof">See the proof</span>' : ''}
        </${tag}>
      </li>`;
    })
    .join('');

  // ---------- "Right now": otomatis dari role yang belum berakhir (end: null) ----------
  const nowEl = $('#now');
  if (nowEl) {
    const ongoing = experienceGroups.flatMap((g) => g.items).filter((x) => x.start && !x.end).sort((a, b) => b.start.localeCompare(a.start));
    const edu = education[0];
    const rows = ongoing.map((x) => `<li><a href="#experience" data-xp="${esc(x.id)}"><i class="xp__now" aria-hidden="true"></i><span><b>${esc(x.role)}</b> at ${esc(x.company)}</span></a></li>`);
    if (edu) rows.push(`<li><a href="#education" data-scroll-to="#education"><i class="xp__now" aria-hidden="true"></i><span><b>Studying ${esc(edu.degree.replace(/^Bachelor of /, '').replace(' — ', ', '))}</b> at ${esc(edu.school)}</span></a></li>`);
    nowEl.innerHTML = rows.length ? `<p class="now__h">Right now</p><ul class="now__list">${rows.join('')}</ul>` : '';
  }

  // ---------- Experience (grouped) ----------
  $('#xgroups').innerHTML = experienceGroups
    .map(
      (g, gi) => `
      <section class="xgroup xgroup--${g.color}" id="xgroup-${g.id}">
        <aside class="xgroup__side" data-reveal>
          <div class="xgroup__card">
            <span class="xgroup__num">${String(gi + 1).padStart(2, '0')} / ${String(experienceGroups.length).padStart(2, '0')}</span>
            <h3>${esc(g.title)}</h3>
            <p>${esc(g.subtitle)} · ${g.items.length} role${g.items.length > 1 ? 's' : ''}</p>
            ${g.photo ? `<figure class="xgroup__photo" data-gphoto="${esc(g.id)}"><figcaption>${esc(g.photoCaption || '')}</figcaption></figure>` : ''}
          </div>
        </aside>
        <div class="xgroup__items">
          ${g.items
            .map(
              (x, i) => `
            <article class="xp ${i === 0 ? 'is-open' : ''}" data-reveal data-xp-id="${esc(x.id || `${g.id}-${i}`)}">
              <button class="xp__toggle" aria-expanded="${i === 0}">
                <span class="xp__logo" data-logo="${esc(g.id)}-${i}"><span>${initials(x.company)}</span></span>
                <span class="xp__text">
                  <span class="xp__role">${esc(x.role)}</span>
                  <span class="xp__company">${esc(x.company)} · ${esc(x.location)}</span>
                </span>
                <span class="xp__right"><span class="xp__period">${/present/i.test(x.period) ? '<i class="xp__now" title="Ongoing"></i>' : ''}${esc(x.period)}</span><span class="xp__chev" aria-hidden="true"></span></span>
              </button>
              <div class="xp__details"><div>
                <div class="xp__body${x.photo ? ' has-photo' : ''}">
                  ${x.photo ? `<figure class="xp__photo" data-xphoto="${esc(x.id || `${g.id}-${i}`)}"><figcaption>${esc(x.photoCaption || '')}</figcaption></figure>` : ''}
                  <ul class="xp__points">${x.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
                  <div class="xp__foot">
                    <div class="xp__tags">${(x.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
                    ${x.link ? `<a class="link" href="${esc(x.link)}" target="_blank" rel="noopener" data-cursor="View">View project</a>` : ''}
                  </div>
                </div>
              </div></div>
            </article>`
            )
            .join('')}
        </div>
      </section>`
    )
    .join('');
  experienceGroups.forEach((g) => g.items.forEach((x, i) => optionalImage(document.querySelector(`[data-logo="${g.id}-${i}"]`), x.logo, x.company)));
  experienceGroups.forEach((g) => g.items.forEach((x, i) => {
    if (!x.photo) return;
    const fig = document.querySelector(`[data-xphoto="${CSS.escape(x.id || `${g.id}-${i}`)}"]`);
    if (fig) { optionalImage(fig, x.photo, x.photoCaption || x.role); fig.prepend(fig.querySelector('img')); }
  }));
  experienceGroups.forEach((g) => {
    const fig = document.querySelector(`[data-gphoto="${g.id}"]`);
    if (fig) { optionalImage(fig, g.photo, g.photoCaption || g.title); fig.prepend(fig.querySelector('img')); }
  });

  // ---------- Work ----------
  $('#work-marketing').innerHTML =
    projects.map(projectCard).join('') +
    `<div class="project--more" data-reveal>
      <h3>${esc(moreWork.label)}</h3>
      <div>
        ${moreWork.canva ? `<a class="btn btn--small" href="${esc(moreWork.canva)}" target="_blank" rel="noopener">Canva portfolio</a>` : ''}
        ${moreWork.linkedin ? `<a class="btn btn--small" href="${esc(moreWork.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
      </div>
    </div>`;
  $('#work-it').innerHTML =
    itProjects.map(projectCard).join('') +
    `<div class="project--more" data-reveal>
      <h3>More code on GitHub</h3>
      <div>${moreWork.github ? `<a class="btn btn--small" href="${esc(moreWork.github)}" target="_blank" rel="noopener">github.com/${esc(moreWork.github.split('/').pop())}</a>` : ''}
      ${moreWork.linkedin ? `<a class="btn btn--small" href="${esc(moreWork.linkedin)}" target="_blank" rel="noopener">Projects on LinkedIn</a>` : ''}</div>
    </div>`;
  [...projects, ...itProjects].forEach((p) => optionalImage(document.querySelector(`[data-cover="${CSS.escape(p.slug)}"]`), p.cover, p.title));
  document.querySelectorAll('.project__card[aria-disabled="true"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));

  // ---------- Skills ----------
  const toolCard = (t) => {
    const ic = icons[t.icon];
    const hex = ic?.hex || '#16140f';
    const light = isLight(hex);
    const inner = ic?.svg ? ic.svg : `<span>${esc(ic?.letter || t.name[0])}</span>`;
    return `<div class="tool marquee__item"><span class="tool__icon ${light ? 'tool__icon--light' : ''}" style="--icon:${hex}" aria-hidden="true">${inner}</span><div><b>${esc(t.name)}</b><span>${esc(t.note)}</span></div></div>`;
  };
  const half = Math.ceil(skills.tools.length / 2);
  const rowA = skills.tools.slice(0, half).map(toolCard).join('');
  const rowB = skills.tools.slice(half).map(toolCard).join('');
  $('#tools-row-a .marquee__track').innerHTML = rowA + rowA;
  $('#tools-row-b .marquee__track').innerHTML = rowB + rowB;
  $('#stickerwall').innerHTML = skills.stickers
    .map((sk, i) => {
      const label = typeof sk === 'string' ? sk : sk.label;
      return `<button class="skill" data-skill="${i}" aria-pressed="false" data-reveal><span class="sticker sticker--${COLORS[i % COLORS.length]}" style="--r:${((i * 7) % 9) - 4}deg">${esc(label)}</span></button>`;
    })
    .join('');

  // ---------- Education ----------
  $('#edu-list').innerHTML = education
    .map(
      (e, i) => `
      <li data-reveal>
        <div class="edu__logo" data-edu="${i}"><span>${initials(e.school)}</span></div>
        <div>
          <h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p>
          ${e.note ? (e.noteFile ? `<a class="edu__note" href="${esc(e.noteFile)}" target="_blank" rel="noopener" data-cursor="PDF">${esc(e.note)}<i>PDF</i></a>` : `<span class="edu__note">${esc(e.note)}</span>`) : ''}
          ${e.file ? `<a class="link edu__file" href="${esc(e.file)}" target="_blank" rel="noopener">Open document</a>` : ''}
        </div>
        <span class="edu__period">${esc(e.period)}</span>
      </li>`
    )
    .join('');
  document.querySelectorAll('.edu__logo[data-edu]').forEach((el) => optionalImage(el, education[+el.dataset.edu].logo, education[+el.dataset.edu].school));
  $('#cert-list').innerHTML = certificates
    .map((c) => {
      const href = c.file || c.link;
      const inner = `<b>${esc(c.title)}</b><span>${esc(c.issuer)} · ${esc(c.year)}${href ? `<i class="certs__pdf">${c.file ? 'PDF' : 'Verify'}</i>` : ''}</span>`;
      return `<li data-reveal>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener" data-cursor="Open">${inner}</a>` : `<div>${inner}</div>`}</li>`;
    })
    .join('');

  // ---------- Contact & footer ----------
  $('#contact-status').textContent = profile.availability;
  const mail = $('#contact-mail');
  mail.textContent = profile.contacts.email;
  mail.href = `mailto:${profile.contacts.email}`;
  $('#contact-socials').innerHTML = profile.socials
    .map((s) => `<li data-reveal><a href="${esc(s.href)}" target="_blank" rel="noopener" data-cursor="Open"><b>${esc(s.label)}</b><span>${esc(s.handle)}</span></a></li>`)
    .join('');
  $('#menu-socials').innerHTML = profile.socials.map((s) => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('');
  $('#year').textContent = new Date().getFullYear();

  // ---------- Footer wordmark (nama raksasa; titiknya = putar ulang opening) ----------
  const wm = $('#wordmark');
  if (wm) {
    wm.setAttribute('aria-label', profile.firstName);
    wm.innerHTML = [...profile.firstName].map((ch) => `<span class="wordmark__l" aria-hidden="true">${esc(ch)}</span>`).join('') +
      `<span class="wordmark__dot" role="button" tabindex="0" aria-label="Replay the opening animation" data-cursor="Replay"></span>`;
  }
}
