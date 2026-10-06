// Bagian Contact: pengunjung memilih "ada perlu apa?" → tombol email & WhatsApp terisi otomatis
// (subjek + kerangka pesan). Pilihan & isi pesan: content/profile.js → contactIntents.
import gsap from 'gsap';
import { sfx } from '../ui/sound.js';

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initComposer(profile) {
  const el = document.querySelector('#composer');
  const intents = profile.contactIntents || [];
  if (!el) return;
  if (!intents.length) { el.remove(); return; }
  const email = profile.contacts.email;
  const wa = (profile.contacts.whatsapp || '').replace(/\/$/, '');
  el.innerHTML = `
    <p class="composer__q">Or pick what it's about and I'll pre-write the message:</p>
    <div class="composer__chips" role="radiogroup" aria-label="Message topic">
      ${intents.map((t, i) => `<button class="composer__chip" role="radio" aria-checked="${i === 0}" data-i="${i}">${esc(t.label)}</button>`).join('')}
    </div>
    <div class="composer__actions">
      <a class="btn composer__mail" data-magnetic>Write the email</a>
      ${wa ? '<a class="btn composer__wa" target="_blank" rel="noopener" data-magnetic>Send it on WhatsApp</a>' : ''}
    </div>`;
  const mail = el.querySelector('.composer__mail');
  const waBtn = el.querySelector('.composer__wa');
  const pick = (i) => {
    const t = intents[i];
    el.querySelectorAll('.composer__chip').forEach((c, j) => c.setAttribute('aria-checked', String(j === i)));
    mail.href = `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
    if (waBtn) waBtn.href = `${wa}?text=${encodeURIComponent(`${t.subject}\n\n${t.body}`)}`;
  };
  el.addEventListener('click', (e) => {
    const chip = e.target.closest('.composer__chip');
    if (!chip) return;
    pick(Number(chip.dataset.i));
    sfx('tick');
    gsap.fromTo(chip, { scale: 0.9, rotate: -4 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  });
  pick(0);
}
