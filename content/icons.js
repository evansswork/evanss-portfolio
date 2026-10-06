// ============================================================
//  ICONS — logo untuk bagian Skills (dari paket simple-icons,
//  tersimpan inline di dalam build, tidak butuh internet).
//  Tambah logo: import siNamaBrand dari 'simple-icons' lalu daftarkan.
//  Daftar nama: https://simpleicons.org  (siNama = "si" + Nama tanpa spasi)
//  Brand yang tidak ada di simple-icons (Canva, CapCut, Klaviyo)
//  memakai badge huruf dengan warna brand.
// ============================================================
import {
  siTiktok, siInstagram, siYoutube, siShopee, siObsstudio, siPython, siTensorflow,
  siGit, siGithub, siTailwindcss, siLeaflet, siJavascript, siHtml5, siCss, siFigma,
  siWhatsapp, siGmail, siLaravel, siPhp, siMysql,
} from 'simple-icons';

const icon = (si) => ({ svg: si.svg, hex: `#${si.hex}`, title: si.title });
const letter = (ch, hex, title) => ({ letter: ch, hex, title });

export const icons = {
  tiktok: icon(siTiktok),
  instagram: icon(siInstagram),
  youtube: icon(siYoutube),
  shopee: icon(siShopee),
  obs: icon(siObsstudio),
  python: icon(siPython),
  tensorflow: icon(siTensorflow),
  git: icon(siGit),
  github: icon(siGithub),
  tailwind: icon(siTailwindcss),
  leaflet: icon(siLeaflet),
  javascript: icon(siJavascript),
  html: icon(siHtml5),
  css: icon(siCss),
  figma: icon(siFigma),
  whatsapp: icon(siWhatsapp),
  gmail: icon(siGmail),
  laravel: icon(siLaravel),
  php: icon(siPhp),
  mysql: icon(siMysql),
  canva: letter('C', '#00C4CC', 'Canva'),
  capcut: letter('Cc', '#111111', 'CapCut'),
  klaviyo: letter('K', '#111111', 'Klaviyo'),
};
