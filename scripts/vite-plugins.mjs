// Plugin Vite yang dipakai vite.config.js (situs) dan vite.single.config.js (preview satu file).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { settings } from '../content/settings.js';
import { profile } from '../content/profile.js';
import { education } from '../content/education.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// SEO dari satu sumber: title, description, og:image absolut, canonical, JSON-LD, <noscript>, robots.txt, sitemap.xml.
// Semua diambil dari content/profile.js & content/settings.js (isi siteUrl setelah deploy).
export function siteMeta() {
  const site = String(settings.siteUrl || '').replace(/\/$/, '');
  const title = `${profile.name} — ${profile.roles.join(', ')}`;
  const description = profile.tagline;
  const sameAs = (profile.socials || []).map((s) => s.href).filter((h) => /^https:\/\//.test(h) && !/wa\.me/.test(h));
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.cvTitle,
    ...(site && { url: site }),
    email: `mailto:${profile.contacts.email}`,
    sameAs,
    alumniOf: education[0]?.school,
    address: { '@type': 'PostalAddress', addressLocality: String(profile.location).split(',')[0], addressCountry: 'ID' },
  };
  const noscript = `<noscript><main class="noscript"><h1>${esc(profile.name)}</h1><p><b>${esc(profile.cvTitle || '')}</b></p><p>${esc(profile.bio?.[0] || '')}</p><p>${[...sameAs.map((h) => `<a href="${esc(h)}">${esc(h.replace(/^https:\/\/(www\.)?/, ''))}</a>`), `<a href="mailto:${esc(profile.contacts.email)}">${esc(profile.contacts.email)}</a>`].join(' | ')}</p><p>This site uses JavaScript for its interactive portfolio.</p></main></noscript>`;
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
        .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
        .replace('content="/images/og.jpg"', `content="${site}/images/og.jpg"`)
        .replace('<!--seo:head-->', site ? `<link rel="canonical" href="${site}/" />\n  <meta property="og:url" content="${site}/" />` : '')
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(person)}</script>`)
        .replace('<!--seo:noscript-->', noscript);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ''}` });
      if (site) {
        this.emitFile({
          type: 'asset', fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
        });
      }
    },
  };
}

// Preview satu file: gambar dari public/images/ ditanam sebagai data URI supaya tampil tanpa server.
const MIME = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
export function inlinePublicImages(outFile = 'dist-single/index.html') {
  return {
    name: 'inline-public-images',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const out = resolve(outFile);
      if (!existsSync(out)) return;
      let count = 0;
      const html = readFileSync(out, 'utf8').replace(/(?<!content=")\/images\/[A-Za-z0-9_\-/.]+\.(?:webp|jpe?g|png|svg)/g, (m) => {
        const file = resolve(`public${m}`);
        if (!existsSync(file)) return m;
        count++;
        return `data:${MIME[extname(file).toLowerCase()]};base64,${readFileSync(file).toString('base64')}`;
      });
      writeFileSync(out, html);
      console.log(`inline-public-images: ${count} gambar ditanam`);
    },
  };
}

// Saat build: rujukan ke gambar/PDF yang belum ada di public/ dikosongkan dari data content/,
// jadi situs produksi tidak membuang permintaan 404 (fallback-nya tetap jalan: inisial, placeholder tersembunyi).
// Tidak dipakai di mode dev, supaya gambar yang baru ditambahkan langsung terlihat.
export function stripMissingAssets() {
  const root = process.cwd();
  return {
    name: 'strip-missing-assets',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      if (!/[\\/]content[\\/][^\\/]+\.js$/.test(id)) return null;
      const out = code.replace(/(['"])((?:file:)?\/(?:images|files)\/[^'"]+)\1/g, (m, q, ref) =>
        (existsSync(resolve(root, `public${ref.replace(/^file:/, '')}`)) ? m : `${q}${q}`));
      return out === code ? null : { code: out, map: null };
    },
  };
}
