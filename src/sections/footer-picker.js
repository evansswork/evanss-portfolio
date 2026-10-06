// Baris "dev" di footer: coba opening lain + tampilkan penanda TODO.
// Aktif kalau content/settings.js → openingPicker: true. Matikan sebelum link dibagikan.
export function initOpeningPicker(names, { onPick }) {
  const wrap = document.querySelector('#opening-picker');
  if (!wrap) return;
  const todosOn = () => document.documentElement.classList.contains('show-todos');
  wrap.innerHTML = `<span>Try openings:</span>${names.map((n) => `<button data-opening="${n}">${n}</button>`).join('')}` +
    `<button class="picker__todos" data-todos aria-pressed="${todosOn()}">Show todos</button>`;
  wrap.hidden = false;
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-opening]');
    if (b) return onPick(b.dataset.opening);
    const t = e.target.closest('[data-todos]');
    if (t) {
      document.documentElement.classList.toggle('show-todos');
      t.setAttribute('aria-pressed', String(todosOn()));
    }
  });
}
