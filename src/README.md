# src/ — kode

Urutan kerja ada di `main.js`: render konten → smooth scroll → scene 3D → fitur → opening → animasi scroll.

| Folder | Isi |
|---|---|
| `core/` | `render.js` (content/ → HTML, termasuk isi case study), `animations.js` (intro hero, reveal, counter, nav), `smooth-scroll.js` (Lenis) |
| `sections/` | Perilaku per section, diberi awalan nama section: `hero-stickers`, `hero-headline`, `experience-timeline`, `experience-accordion`, `experience-links`, `playbook`, `work-tabs`, `achievements`, `skills-evidence`, `contact-composer`, `footer-wordmark`, `footer-clock`, `footer-picker` |
| `dialogs/` | Lapisan di atas halaman: `case-modal` (riwayat browser, Back menutup), `cv` (CV ATS + cetak), `command-palette` (Ctrl/⌘ K), `lightbox` |
| `ui/` | Komponen global: `env` (deteksi perangkat), `cursor`, `magnetic`, `nav`, `toast`, `sound`, `badge`, `tilt`, `marquee`, `files` (sembunyikan PDF yang belum ada), `dialog` (halaman `inert` saat dialog terbuka) |
| `openings/` | Animasi pembuka, satu file per opening (lihat `openings/README.md`) |
| `three/` | `hero-scene.js` — bentuk 3D toon, konfeti, drag, pop, mode fokus |
| `styles/` | `tokens.css` (warna/font), `base.css`, `openings.css`, `sections.css`, `features.css`; digabung di `main.css` |

## Event bersama
- `shapehover` / `shapepop` di `#hero-canvas` → label cursor "Pop!" & suara
- `opening:start` / `opening:handoff` di `window` → judul hero berhenti / mulai berganti
- `data-case="<slug>"`, `data-xp="<id>"`, `data-cv-open`, `data-scroll-to="#id"`, `data-cursor="Teks"`, `data-magnetic` — atribut yang bisa dipasang di elemen mana pun
