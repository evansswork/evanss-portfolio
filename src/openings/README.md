# src/openings/ — animasi pembuka

Satu file = satu opening. Opening yang dipakai diatur di `content/settings.js` → `opening`, atau lewat URL `?opening=<nama>`.

| File | Ringkasan alur | Durasi ± |
|---|---|---|
| `edit.js` (default) | Timeline video editing: jendela preview berisi hero 3D asli, klip Hook / Build-up / Payoff, subtitle, export mengikuti loading sungguhan, lalu *final cut* membesar ke layar penuh. Versi kilat untuk kunjungan berikutnya dalam sesi yang sama | ±2 dtk (kilat ±0,8) |
| `zoom.js` | Hitam → huruf "Evan" muncul sebagai jendela knockout ke hero 3D → titik jatuh & memantul → kamera menyelam ke titik → bentuk 3D meluncur ke posisinya | 3 dtk |
| `paper.js` | Lembar tinta bertuliskan nama → lubang kecil dipukul → 4 lubang (lingkaran, segi enam, pil, bintang) mengembang bergantian, dengan bayangan keras | 2,8 dtk |
| `slot.js` | Kata bergulir → name tag dibanting → terbang ke hero (GSAP Flip) | 3 dtk |
| `none.js` | Langsung ke hero | 0,4 dtk |
| `shared.js` | Alat bantu: warna, pembuat elemen SVG, tunggu font, wadah layar penuh, skip saat diklik | — |
| `index.js` | Daftar opening + pemilih (URL → settings → default) | — |

## Kontrak sebuah opening

Setiap opening adalah fungsi `async` yang menerima objek:

```js
export default async function myOpening({ scene, profile, settings, popShapes, onHandoff }) {
  // scene      → scene 3D (boleh null). scene.prepare({ focus }), scene.release(), scene.focus
  // popShapes  → panggil saat bentuk 3D harus muncul
  // onHandoff  → panggil saat judul hero harus mulai masuk (biasanya saat opening mulai menghilang)
  // resolve/return setelah elemen opening dihapus dari halaman
}
```

Opening juga wajib menghapus penutup statis (`removeCover()` dari `shared.js`) setelah elemennya sendiri tampil.

## Teknik di balik `zoom.js`

- Lapisan SVG berisi persegi **hitam murni** + huruf & titik **putih**, dengan `mix-blend-mode: multiply` dipasang pada wadah `.opening--zoom`.
- Hasil multiply: putih × halaman = halaman (tembus), hitam × halaman = hitam.
- Blend harus ada di wadah terluar karena elemen fixed membuat stacking context sendiri.
- Ukuran huruf diukur di 200px dengan `getComputedTextLength()`, lalu diskalakan agar pas layar.
- Zoom memakai `svgOrigin` di pusat titik; skala akhir dihitung supaya titik menutupi diagonal layar.

## Teknik di balik `edit.js`

- **Jendela ke hero asli**: `.oe-window` transparan dengan `box-shadow: 0 0 0 200vmax` berwarna tinta. Bayangannya menutup seluruh layar kecuali jendela, jadi yang terlihat di dalamnya adalah hero yang sungguhan. *Final cut* cukup menganimasikan left/top/width/height jendela ke ukuran layar — tidak ada pergantian layar.
- **Loading sungguhan**: persentase export dibatasi oleh tiga sumber (font judul, event `load`, scene 3D); *final cut* menunggu semuanya siap (maks. 2,5 detik).
- **Sekali per sesi**: `sessionStorage['evan:intro-seen']` diatur di `main.js`; kalau sudah ada, opening menerima `express: true`.
- **Pelajaran**: jangan beri CSS `transition: transform` pada elemen yang transform-nya dianimasikan GSAP. Keduanya berebut, dan tween GSAP bisa tertahan di nilai awalnya.
