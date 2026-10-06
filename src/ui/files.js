// Tautan ke /files/... (CV, sertifikat, penghargaan) diperiksa saat halaman dibuka.
// File yang belum ada → tautan dinonaktifkan/disembunyikan, jadi pengunjung tidak pernah melihat halaman 404.
export async function checkFiles() {
  const links = [...document.querySelectorAll('a[href^="/files/"]')];
  const hrefs = [...new Set(links.map((a) => a.getAttribute('href')))];
  const missing = new Set();
  await Promise.all(hrefs.map(async (href) => {
    let ok;
    try {
      const r = await fetch(href, { method: 'HEAD', cache: 'no-store' });
      // server dev mengembalikan index.html untuk file yang tidak ada → bukan file asli
      ok = r.ok && !(r.headers.get('content-type') || '').includes('text/html');
    } catch { ok = false; }
    if (!ok) missing.add(href);
  }));
  links.forEach((a) => {
    if (!missing.has(a.getAttribute('href'))) return;
    a.classList.add('is-missing');
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.setAttribute('aria-disabled', 'true');
    a.title = 'Coming soon';
  });
  window.__missingFiles = missing;
  return missing;
}
