// Jam lokal di footer, mis. "Surabaya 20:47 WIB" — titik dua berkedip.
// Kota & zona waktu diatur di content/settings.js.
export function initClock({ city, timezone, timezoneLabel }) {
  const el = document.querySelector('#clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
  const render = () => {
    const parts = fmt.formatToParts(new Date());
    const h = parts.find((p) => p.type === 'hour')?.value ?? '--';
    const m = parts.find((p) => p.type === 'minute')?.value ?? '--';
    el.innerHTML = `${city} <b>${h}<i>:</i>${m}</b> ${timezoneLabel}`;
  };
  render();
  setInterval(render, 15000);
  el.hidden = false;
}
